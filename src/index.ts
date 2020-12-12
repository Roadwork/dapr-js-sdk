import express from "express";
import DaprBinding from "./lib/binding";
import DaprPubSub from "./lib/pubsub";
import DaprState from "./lib/state";
import DaprInvoke from "./lib/invoke";

export default class Dapr {
  url: string;
  urlDapr: string;
  port: number;
  pubsub: DaprPubSub;
  state: DaprState;
  binding: DaprBinding;
  invoke: DaprInvoke;
  express: express.Application;

  constructor(daprUrl: string, daprPort: number) {
    this.url = daprUrl || "127.0.0.1";
    this.port = daprPort || 3500;

    if (!this.url.startsWith('http://') && !this.url.startsWith('https://')) {
      this.url = `http://${this.url}`;
    }

    this.urlDapr = `${this.url}:${this.port}/v1.0`;

    this.express = express();

    this.pubsub = new DaprPubSub(this.express, daprUrl, daprPort);
    this.state = new DaprState(this.express, daprUrl, daprPort);
    this.binding = new DaprBinding(this.express, daprUrl, daprPort);
    this.invoke = new DaprInvoke(this.express, daprUrl, daprPort);
  }
}