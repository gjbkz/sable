import * as http from "node:http";
import connect from "connect";
import * as staticLivereload from "middleware-static-livereload";
import {
	assertFileOperationsAreLocal,
	defaultHost,
	defaultMaxFileOperationBytes,
	pathGuard,
	protectFileOperations,
} from "./security.ts";

export { LogLevel } from "middleware-static-livereload";

type NextFunction = (err?: unknown) => void;
export type SimpleHandleFunction = (
	req: http.IncomingMessage,
	res: http.ServerResponse,
) => void;
export type NextHandleFunction = (
	req: http.IncomingMessage,
	res: http.ServerResponse,
	next: NextFunction,
) => void;
export type ErrorHandleFunction = (
	err: unknown,
	req: http.IncomingMessage,
	res: http.ServerResponse,
	next: NextFunction,
) => void;
export type HandleFunction =
	| SimpleHandleFunction
	| NextHandleFunction
	| ErrorHandleFunction;

export interface SableOptions
	extends Partial<staticLivereload.MiddlewareOptions> {
	/**
	 * The first argument of server.listen()
	 * https://nodejs.org/api/net.html#net_server_listen_port_host_backlog_callback
	 * @default 4000
	 */
	port?: number;
	/**
	 * The second argument of server.listen()
	 * https://nodejs.org/api/net.html#net_server_listen_port_host_backlog_callback
	 * @default "127.0.0.1"
	 */
	host?: string;
	/**
	 * Maximum request body size for file operations.
	 * @default 10485760 (10 MiB)
	 */
	maxFileOperationBytes?: number;
	/**
	 * A list of middlewares.
	 * @default []
	 */
	middlewares?: Array<HandleFunction>;
}

export const startServer = async (
	options: SableOptions = {},
): Promise<http.Server> => {
	const host = options.host ?? defaultHost;
	if (!host.trim()) {
		throw new TypeError("host must not be empty");
	}
	const maxFileOperationBytes =
		options.maxFileOperationBytes ?? defaultMaxFileOperationBytes;
	if (
		!Number.isSafeInteger(maxFileOperationBytes) ||
		maxFileOperationBytes <= 0
	) {
		throw new TypeError(
			"maxFileOperationBytes must be a positive safe integer",
		);
	}
	assertFileOperationsAreLocal(host, options.fileOperations ?? false);
	const app = connect();
	app.use(pathGuard);
	for (const middleware of options.middlewares || []) {
		app.use(middleware);
	}
	const staticMiddleware = staticLivereload.middleware(options);
	app.use(
		protectFileOperations(
			staticMiddleware,
			options.fileOperations ?? false,
			maxFileOperationBytes,
		),
	);
	const server = http.createServer(app);
	return await new Promise<http.Server>((resolve, reject) => {
		server.once("listening", () => {
			const addressInfo = server.address();
			if (addressInfo && typeof addressInfo === "object") {
				const { address, family, port } = addressInfo;
				const portSuffix = port === 80 ? "" : `:${port}`;
				const hostname = family === "IPv6" ? `[${address}]` : host;
				process.stdout.write(`http://${hostname}${portSuffix}\n`);
			}
			resolve(server);
		});
		const listen = (port: number, host?: string) => {
			server.once("error", (error: Error & { code: string }) => {
				if (error.code === "EADDRINUSE") {
					listen(port + 1, host);
				} else {
					reject(error);
				}
			});
			server.listen(port, host);
		};
		listen(options.port ?? 4000, host);
	});
};
