import express, { Application } from 'express';
import * as bodyParser from 'body-parser';
import routes from '../routes';
import middleware from '../middleware';

class App {
  private readonly _express: Application;

  constructor () {
    this._express = express()
    this._express.use(bodyParser.json());
    this._express.use('/api', routes.router);
    this._express.use(middleware.error);
  }

  get express(): Application {
    return this._express
  }
}

export default new App().express;
