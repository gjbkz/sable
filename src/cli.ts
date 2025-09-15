#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Command } from "commander";
import { LogLevel } from "middleware-static-livereload";
import { type SableOptions, startServer } from "./index.ts";

const packageJsonPath =
	typeof __dirname !== "undefined"
		? join(__dirname, "../package.json")
		: typeof import.meta !== "undefined"
			? new URL("../package.json", import.meta.url)
			: undefined;

if (!packageJsonPath) {
	throw new Error("Unable to resolve path to package.json");
}

const { version } = JSON.parse(readFileSync(packageJsonPath, "utf8"));

const program = new Command()
	.version(version)
	.description("Starts a HTTP server for development")
	.option(
		"-p, --port <n>",
		"A port number for HTTP, HTTPS (4000)",
		Number.parseInt,
	)
	.option("-h, --host <s>", "Hostname")
	.option("-v, --verbose", "Enable verbose logging")
	.option("--noWatch", "Disable watching")
	.option("-i, --index <s>", "A filename of index (index.html)")
	.argument("[documentRoot...]", "Paths to serve");

program.parse();

const {
	noWatch,
	port,
	host,
	verbose = false,
	index,
} = program.opts() as {
	port?: Array<number> | number;
	host?: Array<string> | string;
	verbose?: boolean;
	noWatch?: true;
	index?: Array<string> | string;
};
const documentRoot = program.args;
if (documentRoot.length === 0) {
	documentRoot.push(process.cwd());
}
const options: SableOptions = {
	watch: !noWatch,
	documentRoot,
	logLevel: verbose ? LogLevel.debug : LogLevel.info,
};
if (Array.isArray(port)) {
	options.port = port[0];
} else if (port) {
	options.port = port;
}
if (Array.isArray(host)) {
	options.host = host[0];
} else if (host) {
	options.host = host;
}
if (Array.isArray(index)) {
	options.index = index[0];
} else if (index) {
	options.index = index;
}
startServer(options).catch((error) => {
	console.error(error);
	process.exit(1);
});
