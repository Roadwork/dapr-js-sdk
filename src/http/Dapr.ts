import DaprBinding from './lib/binding';
import DaprPubSub from './lib/pubsub';
import DaprState from './lib/state';
import DaprInvoker from './lib/invoker';
import DaprSecret from './lib/secret';
import DaprActor from './lib/actor';
import { WebServerSingleton } from './lib/WebServer';
import { setTimeout } from "timers/promises";

export default class Dapr {
  url: string;
  urlDapr: string;
  daprPort: number;
  daprInternalServerPort: number; // The port for our app server (e.g. dapr binding receives, pubsub receive, ...)
  pubsub: DaprPubSub;
  state: DaprState;
  binding: DaprBinding;
  invoker: DaprInvoker;
  secret: DaprSecret;
  actor: DaprActor;

  constructor(daprUrl: string, daprPort: number, daprInternalServerPort?: number) {
    this.url = daprUrl || '127.0.0.1';
    this.daprPort = daprPort || 3500;
    
    if (!this.url.startsWith('http://') && !this.url.startsWith('https://')) {
      this.url = `http://${this.url}`;
    }

    // Set the internal server port and make it available under env variable DAPR_INTERNAL_SERVER_PORT
    // This will be fetched by the WebServerSingleton
    // We do this to avoid requiring an initialization method on this constructor due to async/await
    this.daprInternalServerPort = daprInternalServerPort || parseInt(process.env.DAPR_INTERNAL_SERVER_PORT || "", 10) || 0;
    process.env.DAPR_INTERNAL_SERVER_PORT = `${this.daprInternalServerPort}`;

    this.urlDapr = `${this.url}:${this.daprPort}/v1.0`;

    this.pubsub = new DaprPubSub(this.urlDapr);
    this.state = new DaprState(this.urlDapr);
    this.binding = new DaprBinding(this.urlDapr);
    this.invoker = new DaprInvoker(this.urlDapr);
    this.secret = new DaprSecret(this.urlDapr);
    this.actor = new DaprActor(this.urlDapr);
  }
  public async start(){
    await WebServerSingleton.start();
  }
}