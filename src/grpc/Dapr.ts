// import DaprGrpc from './proto/dapr/proto';
// import DaprBinding from './lib/binding';
// import DaprPubSub from './lib/pubsub';
// import DaprState from './lib/state';
import GRPCClientSingleton from './lib/GRPCClient/GRPCClientSingleton';
import GRPCServerSingleton from './lib/GRPCServer/GRPCServerSingleton';
import DaprInvoker from './lib/invoker';
// import DaprSecret from './lib/secret';
// import DaprActor from './lib/actor';

export default class Dapr {
  daprHost: string;
  daprPort: string;
  daprInternalServerPort: string; // The port for our app server (e.g. dapr binding receives, pubsub receive, ...)
  // pubsub: DaprPubSub;
  // state: DaprState;
  // binding: DaprBinding;
  invoker: DaprInvoker;
  // secret: DaprSecret;
  // actor: DaprActor;

  constructor(daprHost: string, daprPort: string, daprInternalServerPort: string = "50050") {
    this.daprHost = daprHost || '127.0.0.1';
    this.daprPort = process.env.DAPR_INTERNAL_SERVER_PORT || daprPort || "5005";
    this.daprInternalServerPort = daprInternalServerPort;

    // If DAPR_INTERNAL_SERVER_PORT was not set, we set it
    // This will be fetched by the GRPCServerSingleton
    process.env.DAPR_INTERNAL_SERVER_PORT = this.daprPort;
    
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

  async initialize() {
    await GRPCServerSingleton.initialize(this.daprHost, this.daprInternalServerPort.toString());
    await GRPCClientSingleton.initialize(this.daprHost, this.daprPort.toString());
  }
}