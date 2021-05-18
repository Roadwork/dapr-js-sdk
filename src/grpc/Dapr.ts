// import DaprGrpc from './proto/dapr/proto';
// import DaprBinding from './lib/binding';
// import DaprPubSub from './lib/pubsub';
// import DaprState from './lib/state';
import DaprInvoker from './lib/invoker';
// import DaprSecret from './lib/secret';
// import DaprActor from './lib/actor';

export default class Dapr {
  daprHost: string;
  daprPort: number;
  daprInternalServerPort: number; // The port for our app server (e.g. dapr binding receives, pubsub receive, ...)
  // pubsub: DaprPubSub;
  // state: DaprState;
  // binding: DaprBinding;
  invoker: DaprInvoker;
  // secret: DaprSecret;
  // actor: DaprActor;

  constructor(daprHost: string, daprPort: number, daprInternalServerPort?: number) {
    this.daprHost = daprHost || '127.0.0.1';
    this.daprPort = daprPort || 5005;

    // Set the internal server port and make it available under env variable DAPR_INTERNAL_SERVER_PORT
    // This will be fetched by the WebServerSingleton
    // We do this to avoid requiring an initialization method on this constructor due to async/await
    this.daprInternalServerPort = daprInternalServerPort || parseInt(process.env.DAPR_INTERNAL_SERVER_PORT || "", 10) || 0;
    process.env.DAPR_INTERNAL_SERVER_PORT = `${this.daprInternalServerPort}`;

    this.daprHost = `${this.daprHost}:${this.daprPort}/v1.0`;

    
    // // Get the App Port as set in the Dapr constructor
    // const randomPort = Math.floor(Math.random() * (20000 - 10000 + 1)) + 10000;
    // const appPort = parseInt(process.env.DAPR_INTERNAL_SERVER_PORT || "", 10) || randomPort;

    // this.pubsub = new DaprPubSub(this.daprHost);
    // this.state = new DaprState(this.daprHost);
    // this.binding = new DaprBinding(this.daprHost);
    this.invoker = new DaprInvoker();
    // this.secret = new DaprSecret(this.daprHost);
    // this.actor = new DaprActor(this.daprHost);
  }
}