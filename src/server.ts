import './util/module-alias';
import bodyParser from 'body-parser';
import { Server } from '@overnightjs/core';
import { ForecastController } from './controllers/forecast';
import { Application } from 'express';

export class SetupServer extends Server {

  constructor(private port = 3000){
    super();
  }

  public init(): void {
    this.setupExpress();
    this.setupController();
  }
  
  public getApp(): Application {
    return this.app;
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json);
  }

  private setupController(): void {
    const forecastController = new ForecastController();

    this.addControllers([
      forecastController
    ]);
  }
}