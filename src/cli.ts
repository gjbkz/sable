#!/usr/bin/env node
import * as fs from 'fs/promises';
import {Command} from 'commander';
import {startServer} from './index';

const packageJsonPath = new URL('../package.json', import.meta.url);
const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8')) as {version: string};
const program = new Command()
.version(packageJson.version)
.description('Starts a HTTP server for development')
.usage('[options] <documentRoot ...>')
.option('-p, --port <n>', 'A port number for HTTP, HTTPS (4000)', parseInt)
.option('-h, --host <s>', 'Hostname')
.option('--noWatch', 'Disable watching')
.option('-i, --index <s>', 'A filename of index (index.html)')
.action(async (
    documentRoot: Array<string>,
    {noWatch, port = [], host = [], index = []}: {
        port?: Array<number> | number,
        host?: Array<string> | string,
        noWatch?: true,
        index?: Array<string> | string,
    },
) => {
    await startServer({
        port: Array.isArray(port) ? port[0] : port,
        host: Array.isArray(host) ? host[0] : host,
        index: Array.isArray(index) ? index[0] : index,
        watch: !noWatch,
        documentRoot: 0 < documentRoot.length ? documentRoot : [process.cwd()],
    });
});

program.parse();
