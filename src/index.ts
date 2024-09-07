import * as http from 'http';
import { createRequire } from 'module';
import type * as Connect from 'connect';
import * as staticLivereload from 'middleware-static-livereload';

const require = createRequire(import.meta.url);

export { LogLevel } from 'middleware-static-livereload';

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
   * @default undefined
   */
  host?: string;
  /**
   * A list of middlewares.
   * @default []
   */
  middlewares?: Array<Connect.HandleFunction>;
}

export const startServer = async (
  options: SableOptions = {},
): Promise<http.Server> => {
  console.info({ sableOptions: options });
  const app = (require('connect') as () => Connect.Server)();
  for (const middleware of options.middlewares || []) {
    app.use(middleware);
  }
  app.use(staticLivereload.middleware(options));
  const server = http.createServer(app);
  return await new Promise<http.Server>((resolve, reject) => {
    server.once('listening', () => {
      const addressInfo = server.address();
      if (addressInfo && typeof addressInfo === 'object') {
        const { address, family, port } = addressInfo;
        const portSuffix = port === 80 ? '' : `:${port}`;
        const hostname =
          options.host ||
          (portSuffix && family === 'IPv6' ? `[${address}]` : address);
        process.stdout.write(`http://${hostname}${portSuffix}\n`);
      }
      resolve(server);
    });
    const listen = (port: number, host?: string) => {
      server.once('error', (error: Error & { code: string }) => {
        if (error.code === 'EADDRINUSE') {
          listen(port + 1, host);
        } else {
          reject(error);
        }
      });
      server.listen(port, host);
    };
    listen(options.port || 4000, options.host);
  });
};
