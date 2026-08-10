# Sable

[![test](https://github.com/kei-ito/sable/actions/workflows/test.yml/badge.svg)](https://github.com/kei-ito/sable/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/kei-ito/sable/branch/master/graph/badge.svg)](https://codecov.io/gh/kei-ito/sable)

An HTTP development server that serves static files and reloads the browser when files change. If the configured port is already in use, sable automatically tries the next one, so multiple projects can run side by side without any configuration changes.

## Quick start

No installation required. Run the following command to serve the current directory:

```
npx sable .
```

The server URL is printed to stdout once it is ready. Edit any file in the directory and the browser reloads automatically.

## Install

```
npm install sable --save-dev
```

## CLI

```
$ sable -h
Usage: sable [options] [documentRoot...]

Starts an HTTP development server

Options:
  -V, --version        Output the version number
  -p, --port <n>       Port number for HTTP/HTTPS (default: 4000)
  -h, --host <s>       Host name to bind (default: 127.0.0.1)
  -v, --verbose        Enable verbose logging
  --noWatch            Set the watch option to false
  -i, --index <s>      Value for the index option (default: index.html)
  -F, --fileOperations Enable all file operations (upload, delete, text upload)
  --allowFileUpload    Enable file upload
  --allowDelete        Enable file deletion
  --allowTextUpload    Enable text upload
  --maxFileOperationBytes <n>
                        Maximum request body size for file operations (default: 10485760)
  [documentRoot...]    Directories that contain files to be served
  --help               Output usage information
```

## Javascript API

```javascript
import {startServer} from 'sable';
startServer({/* options */})
.then((server) => console.log(server.address()))
```

### Options

`startServer` supports all options from [middleware-static-livereload], plus
`port`, `host`, and `middlewares`.

```javascript
interface SableOptions extends Partial<MiddlewareOptions> {
    /**
     * The first argument of server.listen()
     * https://nodejs.org/api/net.html#net_server_listen_port_host_backlog_callback
     * @default 4000
     */
    port?: number,
    /**
     * The second argument of server.listen()
     * https://nodejs.org/api/net.html#net_server_listen_port_host_backlog_callback
     * @default "127.0.0.1"
     */
    host?: string,
    /**
     * Maximum request body size for file operations.
     * @default 10485760 (10 MiB)
     */
    maxFileOperationBytes?: number,
    /**
     * A list of middlewares.
     * @default []
     */
    middlewares?: Array<connect.HandleFunction>,
}
```

### Security

Sable listens on `127.0.0.1` by default. To make a read-only server available
to other devices, explicitly pass `--host 0.0.0.0` or `--host ::`. Anyone who
can reach that address can read the files under `documentRoot`, so do not serve
directories containing secrets.

File upload, deletion, and text upload are restricted to loopback hosts. File
operation requests are also limited to the same origin and to a 10 MiB body by
default. Use `maxFileOperationBytes` to choose a different positive limit.

[middleware-static-livereload]: https://github.com/kei-ito/middleware-static-livereload#options

## LICENSE

The sable project is licensed under the terms of the Apache 2.0 License.
