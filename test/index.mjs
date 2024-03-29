/* eslint-disable import/no-extraneous-dependencies */
import * as childProcess from 'child_process';
import * as stream from 'stream';
import {fileURLToPath} from 'url';
import test from 'ava';
import fetch from 'node-fetch';
// eslint-disable-next-line import/no-relative-parent-imports
import {startServer} from '../lib/index.mjs';

const cwd = new URL('.', import.meta.url);

test.before(() => {
    childProcess.execSync('npm install --no-save', {cwd, stdio: 'inherit'});
});

test.beforeEach((beforeT) => {
    beforeT.context.start = async (t, command) => {
        const process = t.context.process = childProcess.spawn(
            `npx ${command}`,
            {cwd, shell: true},
        );
        const localURL = await new Promise((resolve, reject) => {
            const chunks = [];
            let totalLength = 0;
            const check = (chunk) => {
                chunks.push(chunk);
                totalLength += chunk.length;
                const concatenated = Buffer.concat(chunks, totalLength);
                const matched = (/http:\/\/\S+/).exec(`${concatenated}`);
                if (matched) {
                    resolve(new URL(matched[0]));
                }
            };
            process.stdout.pipe(new stream.Writable({
                write(chunk, _encoding, callback) {
                    check(chunk);
                    callback();
                },
                final(callback) {
                    reject(new Error(`Failed to get a local URL: ${Buffer.concat(chunks, totalLength)}`));
                    callback();
                },
            }));
            process.stderr.pipe(new stream.Writable({
                write(chunk, _encoding, callback) {
                    check(chunk);
                    callback();
                },
            }));
        });
        return localURL;
    };
});

test.afterEach(async (t) => {
    if (t.context.process) {
        t.context.process.kill();
    }
    const {server} = t.context;
    if (server) {
        await new Promise((resolve, reject) => {
            server.close((error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }
});

let port = 9200;

test('GET /src', async (t) => {
    const localURL = await t.context.start(t, `sable --port ${port++} --host localhost`);
    const res = await fetch(new URL('/src', localURL.href).href);
    t.is(res.status, 200);
    t.is(res.headers.get('content-type'), 'text/html; charset=UTF-8');
    const html = await res.text();
    t.true(html.includes('<script'));
});

test('GET /src (documentRoot)', async (t) => {
    const localURL = await t.context.start(t, `sable --port ${port++} --host localhost src`);
    const res = await fetch(new URL('/', localURL.href).href);
    t.is(res.status, 200);
});

test('GET /', async (t) => {
    const localURL = await t.context.start(t, `sable --port ${port++} --host localhost`);
    const res = await fetch(new URL('/', localURL.href).href);
    t.is(res.status, 200);
});

test('GET /index.mjs', async (t) => {
    const config = {
        host: 'localhost',
        port: port++,
        documentRoot: fileURLToPath(cwd),
    };
    const server = t.context.server = await startServer(config);
    const addressInfo = server.address();
    if (addressInfo && typeof addressInfo === 'object') {
        const res = await fetch(new URL(`http://localhost:${addressInfo.port}/index.mjs`).href);
        t.is(res.status, 200);
    } else {
        t.is(typeof addressInfo, 'object');
    }
});
