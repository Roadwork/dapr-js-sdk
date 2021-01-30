import express from 'express';
import DaprBinding from './lib/binding';
import DaprPubSub from './lib/pubsub';
import DaprState from './lib/state';
import DaprInvoke from './lib/invoke';

export default class Dapr {
  url: string;
  urlDapr: string;
  daprPort: number;
  daprAppPort: number; // The port for our app server (e.g. dapr binding receives, pubsub receive, ...)
  pubsub: DaprPubSub;
  state: DaprState;
  binding: DaprBinding;
  invoke: DaprInvoke;
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
    this.invoke = new DaprInvoke(this.express, this.urlDapr);
  }

  async initialize() {
    return new Promise<void>((resolve, reject) => this.express.listen(this.daprAppPort, resolve));
  }
}
