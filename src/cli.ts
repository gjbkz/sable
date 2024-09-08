#!/usr/bin/env node
import { Command } from "commander";
import { LogLevel } from "middleware-static-livereload";
import { startServer, type SableOptions } from "./index";

const { version } = require("../package.json");
const program = new Command()
	.version(version)
	.description("Starts a HTTP server for development")
	.usage("[options] <documentRoot ...>")
	.option(
		"-p, --port <n>",
		"A port number for HTTP, HTTPS (4000)",
		Number.parseInt,
	)
	.option("-h, --host <s>", "Hostname")
	.option("-v, --verbose", "Enable verbose logging")
	.option("--noWatch", "Disable watching")
	.option("-i, --index <s>", "A filename of index (index.html)")
	.action(
		async (
			{
				noWatch,
				port,
				host,
				verbose = false,
				index,
			}: {
				port?: Array<number> | number;
				host?: Array<string> | string;
				verbose?: boolean;
				noWatch?: true;
				index?: Array<string> | string;
			},
			{ args: documentRoot },
		) => {
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
			await startServer(options);
		},
	);

program.parse();
