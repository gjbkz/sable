import type * as http from "node:http";
import { isIP } from "node:net";
import { Transform } from "node:stream";

type NextFunction = (err?: unknown) => void;
type HandleFunction = (
	req: http.IncomingMessage,
	res: http.ServerResponse,
	next: NextFunction,
) => void;

type FileOperations =
	| boolean
	| {
			allowFileUpload?: boolean;
			allowDelete?: boolean;
			allowTextUpload?: boolean;
	  };

export const defaultHost = "127.0.0.1";
export const defaultMaxFileOperationBytes = 10 * 1024 * 1024;

const safePathRoot = new URL("file:///__sable_document_root__/");
const fileOperationBodyTooLarge = Symbol("fileOperationBodyTooLarge");

const sendError = (
	res: http.ServerResponse,
	statusCode: number,
	message: string,
) => {
	res.statusCode = statusCode;
	res.setHeader("content-type", "text/plain; charset=UTF-8");
	res.end(message);
};

export const isRequestPathSafe = (
	requestTarget: string | undefined,
): boolean => {
	try {
		const requestUrl = new URL(requestTarget || "/", "http://localhost");
		const decodedPathname = decodeURIComponent(requestUrl.pathname);
		if (!decodedPathname.startsWith("/") || decodedPathname.includes("\0")) {
			return false;
		}
		const resolved = new URL(decodedPathname.slice(1), safePathRoot);
		return (
			resolved.protocol === safePathRoot.protocol &&
			resolved.href.startsWith(safePathRoot.href)
		);
	} catch {
		return false;
	}
};

export const pathGuard: HandleFunction = (req, res, next) => {
	if (isRequestPathSafe(req.url)) {
		next();
		return;
	}
	sendError(res, 400, "Bad Request: invalid path");
};

export const hasFileOperations = (fileOperations: FileOperations): boolean => {
	if (fileOperations === true) {
		return true;
	}
	return Boolean(
		fileOperations &&
			(fileOperations.allowFileUpload ||
				fileOperations.allowDelete ||
				fileOperations.allowTextUpload),
	);
};

export const isLoopbackHost = (host: string): boolean => {
	const normalizedHost = host.toLowerCase();
	if (normalizedHost === "localhost" || normalizedHost === "::1") {
		return true;
	}
	if (isIP(normalizedHost) === 4) {
		return normalizedHost.split(".")[0] === "127";
	}
	return normalizedHost.startsWith("::ffff:127.");
};

export const assertFileOperationsAreLocal = (
	host: string,
	fileOperations: FileOperations,
) => {
	if (hasFileOperations(fileOperations) && !isLoopbackHost(host)) {
		throw new Error(
			"File operations require a loopback host (127.0.0.1, ::1, or localhost)",
		);
	}
};

const isFileOperationRequest = (req: http.IncomingMessage): boolean => {
	if (req.method !== "POST") {
		return false;
	}
	try {
		const requestUrl = new URL(req.url || "/", "http://localhost");
		return requestUrl.searchParams.has("_mslAction");
	} catch {
		return false;
	}
};

const hasAllowedOrigin = (req: http.IncomingMessage): boolean => {
	const fetchSite = req.headers["sec-fetch-site"];
	if (fetchSite === "cross-site") {
		return false;
	}
	const origin = req.headers.origin;
	if (!origin) {
		return true;
	}
	if (!req.headers.host) {
		return false;
	}
	try {
		return (
			new URL(origin).host.toLowerCase() === req.headers.host.toLowerCase()
		);
	} catch {
		return false;
	}
};

const createLimitedRequest = (
	req: http.IncomingMessage,
	res: http.ServerResponse,
	maxBytes: number,
): http.IncomingMessage => {
	let receivedBytes = 0;
	const limitedRequest = new Transform({
		transform(chunk: Buffer, _encoding, callback) {
			receivedBytes += chunk.length;
			if (receivedBytes > maxBytes) {
				const error = new Error("File operation body is too large");
				Object.assign(error, { [fileOperationBodyTooLarge]: true });
				callback(error);
			} else {
				callback(null, chunk);
			}
		},
	});
	Object.assign(limitedRequest, {
		method: req.method,
		url: req.url,
		headers: req.headers,
	});
	limitedRequest.once("error", (error) => {
		if (
			typeof error === "object" &&
			error !== null &&
			fileOperationBodyTooLarge in error &&
			!res.writableEnded
		) {
			sendError(res, 413, "Payload Too Large");
		}
		req.unpipe(limitedRequest);
		req.resume();
	});
	req.once("aborted", () =>
		limitedRequest.destroy(new Error("Request aborted")),
	);
	req.once("error", (error) => limitedRequest.destroy(error));
	req.pipe(limitedRequest);
	return limitedRequest as unknown as http.IncomingMessage;
};

export const protectFileOperations = (
	handler: HandleFunction,
	fileOperations: FileOperations,
	maxBytes: number,
): HandleFunction => {
	if (!hasFileOperations(fileOperations)) {
		return handler;
	}
	return (req, res, next) => {
		if (!isFileOperationRequest(req)) {
			handler(req, res, next);
			return;
		}
		if (!hasAllowedOrigin(req)) {
			sendError(res, 403, "Forbidden: cross-origin file operation");
			return;
		}
		const contentLength = req.headers["content-length"];
		if (
			typeof contentLength === "string" &&
			(!/^\d+$/.test(contentLength) || Number(contentLength) > maxBytes)
		) {
			sendError(res, 413, "Payload Too Large");
			return;
		}
		handler(createLimitedRequest(req, res, maxBytes), res, next);
	};
};
