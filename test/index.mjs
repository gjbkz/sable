/* eslint-disable import/no-extraneous-dependencies */
//@ts-check
import * as assert from "node:assert/strict";
import * as childProcess from "node:child_process";
import * as stream from "node:stream";
import { test } from "node:test";
import { startServer } from "../esm/index.mjs";

const cwd = new URL(".", import.meta.url);
/** @type {Set<{name: string, fn: () => void | Promise<void>}>} */
const closeFunctions = new Set();
const onClose = async () => {
	const total = closeFunctions.size;
	for (const { name, fn } of closeFunctions) {
		const index = total - closeFunctions.size;
		console.info(`closing ${name} (${index + 1}/${total})`);
		await fn();
		console.info(`closed ${name} (${index + 1}/${total})`);
	}
	closeFunctions.clear();
};

/**
 * @param {string} command
 * @returns {Promise<{localUrl: URL, abc: AbortController}>}
 */
const start = async (command) => {
	const abc = new AbortController();
	closeFunctions.add({ name: "AbortController", fn: () => abc.abort() });
	const timeoutMs = 10000;
	const timerId = setTimeout(() => abc.abort(), timeoutMs);
	abc.signal.addEventListener("abort", () => clearTimeout(timerId));
	const child = childProcess.spawn(`npx ${command}`, {
		cwd,
		shell: true,
		detached: process.platform !== "win32",
	});
	const kill = () => {
		console.info(`stopping ${child.pid} (${process.platform})`);
		let command = "";
		switch (process.platform) {
			case "win32":
				command = `taskkill /pid ${child.pid} /f /t`;
				break;
			default:
				command = `kill -15 ${child.pid}`;
				break;
		}
		if (command) {
			console.info(`executing: ${command}`);
			childProcess.spawnSync(command, { stdio: "inherit", shell: true });
		}
		console.info(`stopped ${child.pid} (${process.platform})`);
	};
	abc.signal.addEventListener("abort", kill);
	const localUrl = await new Promise((resolve, reject) => {
		/** @type {Array<Buffer>} */
		const chunks = [];
		let totalLength = 0;
		const watcher = new stream.Writable({
			write(chunk, _encoding, callback) {
				console.info(`${chunk}`);
				check(chunk);
				callback();
			},
			final(callback) {
				reject(
					new Error(
						[
							`Failed to get a local URL: ${Buffer.concat(chunks, totalLength)}`.trim(),
							`command: ${command}`,
						].join("\n"),
					),
				);
				callback();
			},
		});
		/** @param {Buffer} chunk */
		const check = (chunk) => {
			chunks.push(chunk);
			totalLength += chunk.length;
			const concatenated = Buffer.concat(chunks, totalLength);
			const matched = /http:\/\/\S+/.exec(`${concatenated}`);
			if (matched) {
				child.stdout.unpipe(watcher);
				child.stderr.unpipe(watcher);
				resolve(new URL(matched[0]));
			}
		};
		child.stdout.pipe(watcher);
		child.stderr.pipe(watcher);
	});
	return { localUrl, abc };
};

test.before(() => {
	console.info("---- test.before ----");
	childProcess.execSync("npm install --no-save", { cwd, stdio: "inherit" });
});

test.beforeEach(async () => {
	console.info("---- test.beforeEach ----");
});

test.afterEach(async () => {
	console.info("---- test.afterEach ----");
	await onClose();
});

test.after(async () => {
	console.info("---- test.after ----");
	await onClose();
});

let port = 9200;

test("rejects file operations on non-loopback hosts", async () => {
	await assert.rejects(
		startServer({ host: "0.0.0.0", fileOperations: true }),
		/require a loopback host/,
	);
});

test("GET /src", async (_t) => {
	const command = `sable --verbose --port ${port++}`;
	const { localUrl, abc } = await start(command);
	const res = await fetch(new URL("/src", localUrl), { signal: abc.signal });
	assert.equal(res.status, 200);
	assert.equal(res.headers.get("content-type"), "text/html; charset=UTF-8");
	const html = await res.text();
	assert.ok(html.includes('href="./index.html"'));
});

test("GET /src (documentRoot)", async (_t) => {
	const command = `sable --verbose --port ${port++} src`;
	const { localUrl, abc } = await start(command);
	const res = await fetch(new URL("/", localUrl), { signal: abc.signal });
	assert.equal(res.status, 200);
	const html = await res.text();
	assert.ok(html.includes("test-src"));
});

test("GET /", async (_t) => {
	const command = `sable --verbose --port ${port++}`;
	const { localUrl, abc } = await start(command);
	assert.equal(localUrl.hostname, "127.0.0.1");
	const res = await fetch(new URL("/", localUrl), { signal: abc.signal });
	assert.equal(res.status, 200);
});

test("rejects paths that escape documentRoot", async (_t) => {
	const command = `sable --verbose --port ${port++} src`;
	const { localUrl, abc } = await start(command);
	for (const pathname of [
		"/%252e%252e/index.mjs",
		"/%252e%252e/%252e%252e/package.json",
		"/%2fetc/passwd",
	]) {
		const res = await fetch(new URL(pathname, localUrl), {
			signal: abc.signal,
		});
		assert.equal(res.status, 400, pathname);
	}
});

test("rejects cross-origin file operations", async (_t) => {
	const command = `sable --verbose --port ${port++} --allowTextUpload src`;
	const { localUrl, abc } = await start(command);
	const res = await fetch(
		new URL("/?_mslAction=upload&name=blocked.txt", localUrl),
		{
			method: "POST",
			headers: { origin: "https://example.com" },
			body: "blocked",
			signal: abc.signal,
		},
	);
	assert.equal(res.status, 403);
});

test("limits file operation request bodies", async (_t) => {
	const command = `sable --verbose --port ${port++} --allowTextUpload --maxFileOperationBytes 4 src`;
	const { localUrl, abc } = await start(command);
	const res = await fetch(
		new URL("/?_mslAction=upload&name=blocked.txt", localUrl),
		{
			method: "POST",
			body: "12345",
			signal: abc.signal,
		},
	);
	assert.equal(res.status, 413);
});

test("GET /index.mjs", async (_t) => {
	const command = `sable --verbose --port ${port++}`;
	const { localUrl, abc } = await start(command);
	const res = await fetch(
		new URL(`http://localhost:${localUrl.port}/index.mjs`),
		{ signal: abc.signal },
	);
	assert.equal(res.status, 200);
});
