/* eslint-disable import/no-extraneous-dependencies */
//@ts-check
import * as childProcess from 'node:child_process';
import * as stream from 'node:stream';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import { startServer } from '../lib/index.mjs';

const cwd = new URL('.', import.meta.url);
/** @type {Set<() => void | Promise<void>>} */
const closeFunctions = new Set();

/**
 * @param {string} command
 * @returns {Promise<URL>}
 */
const start = async (command) => {
  const process = childProcess.spawn(`npx ${command}`, { cwd, shell: true });
  closeFunctions.add(() => {
    process.kill();
  });
  const localURL = await new Promise((resolve, reject) => {
    const chunks = [];
    let totalLength = 0;
    /**
     * @param {Buffer} chunk
     */
    const check = (chunk) => {
      chunks.push(chunk);
      totalLength += chunk.length;
      const concatenated = Buffer.concat(chunks, totalLength);
      const matched = /http:\/\/\S+/.exec(`${concatenated}`);
      if (matched) {
        resolve(new URL(matched[0]));
      }
    };
    process.stdout.pipe(
      new stream.Writable({
        write(chunk, _encoding, callback) {
          console.info(`${chunk}`);
          check(chunk);
          callback();
        },
        final(callback) {
          reject(
            new Error(
              `Failed to get a local URL: ${Buffer.concat(
                chunks,
                totalLength,
              )}`,
            ),
          );
          callback();
        },
      }),
    );
    process.stderr.pipe(
      new stream.Writable({
        write(chunk, _encoding, callback) {
          check(chunk);
          callback();
        },
      }),
    );
  });
  return localURL;
};

test.afterEach(async (t) => {
  await Promise.all([...closeFunctions].map((fn) => fn()));
  closeFunctions.clear();
});

let port = 9200;

test('GET /src', async (t) => {
  const command = `sable --verbose --port ${port++}`;
  const localURL = await start(command);
  const res = await fetch(new URL('/src', localURL.href));
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('content-type'), 'text/html; charset=UTF-8');
  const html = await res.text();
  assert.ok(html.includes('href="./index.html"'));
});

test('GET /src (documentRoot)', async (t) => {
  const command = `sable --verbose --port ${port++} src`;
  const localURL = await start(command);
  const res = await fetch(new URL('/', localURL.href));
  assert.equal(res.status, 200);
  const html = await res.text();
  console.info(html);
  assert.ok(html.includes('test-src'));
});

test('GET /', async (t) => {
  const command = `sable --verbose --port ${port++}`;
  const localURL = await start(command);
  const res = await fetch(new URL('/', localURL.href));
  assert.equal(res.status, 200);
});

test('GET /index.mjs', async (t) => {
  const command = `sable --verbose --port ${port++}`;
  const localURL = await start(command);
  const res = await fetch(
    new URL(`http://localhost:${localURL.port}/index.mjs`),
  );
  assert.equal(res.status, 200);
});
