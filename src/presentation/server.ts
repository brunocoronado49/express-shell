import path from 'node:path';
import express, { Router } from 'express';

interface Options {
  port: number;
  routes: Router;
  publicPath?: string;
}

export class Server {
  public readonly app = express();
  private serverListener?: any;
  private readonly port: number;
  private readonly publicPath: string;
  private readonly routes: Router;

  constructor(options: Options) {
    const { port, routes, publicPath = 'public' } = options;
    this.port = port;
    this.routes = routes;
    this.publicPath = publicPath;
  }

  async start() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.use(express.static(this.publicPath));

    this.app.use(this.routes);

    this.app.get('/', (req, res) => {
      const indexPath = path.join(__dirname + `../../${this.publicPath}/index.html`);
      res.sendFile(indexPath);
    });

    this.serverListener = this.app.listen(this.port, () => {
      console.log(`Server running on port: ${this.port}`);
    });
  }

  public close() {
    this.serverListener?.close();
  }
}
