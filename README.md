# Sable

[![test](https://github.com/kei-ito/sable/actions/workflows/test.yml/badge.svg)](https://github.com/kei-ito/sable/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/kei-ito/sable/branch/master/graph/badge.svg)](https://codecov.io/gh/kei-ito/sable)

Starts an HTTP development server.

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
  -V, --version    Output the version number
  -p, --port <n>   Port number for HTTP/HTTPS (default: 4000)
  -h, --host <s>   Host name to bind
  -v, --verbose    Enable verbose logging
  --noWatch        Set the watch option to false
  -i, --index <s>  Value for the index option (default: index.html)
  [documentRoot...] Directories that contain files to be served
  -h, --help       Output usage information
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
     * @default undefined
     */
    host?: string,
    /**
     * A list of middlewares.
     * @default []
     */
    middlewares?: Array<connect.HandleFunction>,
}
```

[middleware-static-livereload]: https://github.com/kei-ito/middleware-static-livereload#options

## LICENSE

The sable project is licensed under the terms of the Apache 2.0 License.
