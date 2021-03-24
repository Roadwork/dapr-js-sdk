import http from 'http';
import { AddressInfo } from 'net';
import express from 'express';
import DaprBinding from './lib/binding';
import DaprPubSub from './lib/pubsub';
import DaprState from './lib/state';
import DaprInvoker from './lib/invoker';
import DaprSecret from './lib/secret';
import DaprActor from './lib/actor';

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
  actor: DaprActor;

  constructor(daprUrl: string, daprPort: number, daprAppPort?: number) {
    this.url = daprUrl || '127.0.0.1';
    this.daprPort = daprPort || 3500;
    this.daprAppPort = daprAppPort || 0; // get port from express

    if (!this.url.startsWith('http://') && !this.url.startsWith('https://')) {
      this.url = `http://${this.url}`;
    }

    this.urlDapr = `${this.url}:${this.daprPort}/v1.0`;

    this.pubsub = new DaprPubSub(this.urlDapr);
    this.state = new DaprState(this.urlDapr);
    this.binding = new DaprBinding(this.urlDapr);
    this.invoker = new DaprInvoker(this.urlDapr);
    this.secret = new DaprSecret(this.urlDapr);
    this.actor = new DaprActor(this.urlDapr);
  }
}