import express, { type Express } from "express";
import router from "./routes/index.ts";

interface ServerOptions {
  port: number;
}

export class Server {
  private readonly port: number;
  private readonly server: Express;

  constructor(options: ServerOptions) {
    this.port = options.port;
    this.server = express();

    // Middlewares
    this.server.use(express.json());

    // Rutas base
    this.server.use('/api', router);
  }

  start() {
    this.server.listen(this.port, () => {
      console.log(`Server running on port: ${this.port}`);
    });
  }
}