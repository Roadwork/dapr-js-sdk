import express from 'express';
import DaprBinding from './lib/binding';
import DaprPubSub from './lib/pubsub';
import DaprState from './lib/state';
import DaprInvoker from './lib/invoker';
import DaprSecret from './lib/secret';

export default class Dapr {
  url: string;
  urlDapr: string;
  daprPort: number;
  daprAppPort: number; // The port for our app server (e.g. dapr binding receives, pubsub receive, ...)
  pubsub: DaprPubSub;
  state: DaprState;
  binding: DaprBinding;
  invoker: DaprInvoker;
  secret: DaprSecret;
  express: express.Application;

  constructor(daprUrl: string, daprPort: number, daprAppPort?: number) {
    this.url = daprUrl || '127.0.0.1';
    this.daprPort = daprPort || 3500;
    this.daprAppPort = daprAppPort || 0; // get port from express

    if (!this.url.startsWith('http://') && !this.url.startsWith('https://')) {
      this.url = `http://${this.url}`;
    }

    this.urlDapr = `${this.url}:${this.daprPort}/v1.0`;

    this.express = express();
    this.express.use(express.json()); // json middleware parser

    this.pubsub = new DaprPubSub(this.express, this.urlDapr);
    this.state = new DaprState(this.express, this.urlDapr);
    this.binding = new DaprBinding(this.express, this.urlDapr);
    this.invoker = new DaprInvoker(this.express, this.urlDapr);
    this.secret = new DaprSecret(this.express, this.urlDapr);
  }

  async initialize() {
    return new Promise<void>((resolve, reject) => this.express.listen(this.daprAppPort, resolve));
  }
}
