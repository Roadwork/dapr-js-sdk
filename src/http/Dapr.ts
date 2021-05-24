import DaprBinding from './lib/binding';
import DaprPubSub from './lib/pubsub';
import DaprState from './lib/state';
import DaprInvoker from './lib/invoker';
import DaprSecret from './lib/secret';
import DaprActor from './lib/actor';
import { WebServerSingleton } from './lib/WebServer';
import { setTimeout } from "timers/promises";

export default class Dapr {
    daprHost: string;
    daprPort: string;
    daprInternalServerPort: string; // The port for our app server (e.g. dapr binding receives, pubsub receive, ...)
    daprUrl: string;
    pubsub: DaprPubSub;
    state: DaprState;
    binding: DaprBinding;
    invoker: DaprInvoker;
    secret: DaprSecret;
    actor: DaprActor;

    constructor(daprHost: string, daprPort: string, daprInternalServerPort?: string) {
        this.daprHost = daprHost || '127.0.0.1';
        this.daprPort = daprPort || "5005";
        this.daprInternalServerPort = process.env.DAPR_INTERNAL_SERVER_PORT || daprInternalServerPort || "5006";

        if (!this.daprHost.startsWith('http://') && !this.daprHost.startsWith('https://')) {
          this.daprUrl = `http://${this.daprHost}:${this.daprPort}/v1.0`;
        } else {
          this.daprUrl = `${this.daprHost}:${this.daprPort}/v1.0`;
        }

        this.pubsub = new DaprPubSub(this.daprUrl);
        this.state = new DaprState(this.daprUrl);
        this.binding = new DaprBinding(this.daprUrl);
        this.invoker = new DaprInvoker(this.daprUrl);
        this.secret = new DaprSecret(this.daprUrl);
        this.actor = new DaprActor(this.daprUrl);
    }

    public async startServer() {
      await WebServerSingleton.startServer(this.daprHost, this.daprInternalServerPort);
    }

    public async startClient() {
      // the client is not required here since we use node-fetch for this
    }
}