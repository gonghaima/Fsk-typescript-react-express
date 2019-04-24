import * as express from "express";
import * as bodyParser from "body-parser";
import { Server } from "@overnightjs/core";
import { cimp, cinfo } from "simple-color-print";
import DemoController from "./controllers/demo/DemoController";

class DemoServer extends Server {
  private readonly _SERVER_START_MSG = "Demo server started on port: ";
  private readonly _DEV_MSG =
    "Express Server is running in development mode. Start the React " +
    'development server "npm run start:react" to develop front-end content. Back-end is ' +
    "currently running on port: ";

  private _port = 3001;

  constructor() {
    super();

    // Setup json middleware
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));

    // Setup the controllers
    super.addControllers(new DemoController());

    // Point to front-end code
    if (process.env.NODE_ENV !== "production") {
      cinfo("Starting server in development mode");
      const msg = this._DEV_MSG + process.env.EXPRESS_PORT;
      this.app.get("*", (req, res) => res.send(msg));
    }
  }

  public start(): void {
    this.app.listen(this._port, () => {
      cimp(this._SERVER_START_MSG + this._port);
    });
  }
}

export default DemoServer;
