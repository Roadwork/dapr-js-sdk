import DaprServerBinding from './lib/GRPCServer/binding';
import DaprServerPubSub from './lib/GRPCServer/pubsub';
import DaprServerInvoker from './lib/GRPCServer/invoker';
import DaprServerActor from './lib/GRPCServer/actor';
import GRPCServer from './lib/GRPCServer/GRPCServer';

export default class DaprServer {
  daprHost: string;
  daprPort: string;
  daprInternalServerPort: string; // The port for our app server (e.g. dapr binding receives, pubsub receive, ...)\
  daprServer: GRPCServer;
  pubsub: DaprServerPubSub;
  binding: DaprServerBinding;
  invoker: DaprServerInvoker;
  actor: DaprServerActor;

  constructor(daprHost: string, daprPort: string, daprInternalServerPort: string = "50050") {
    this.daprHost = daprHost || '127.0.0.1';
    this.daprPort = daprPort || "5005";
    this.daprInternalServerPort = process.env.DAPR_INTERNAL_SERVER_PORT || daprInternalServerPort;
    this.daprServer = new GRPCServer();

    // If DAPR_INTERNAL_SERVER_PORT was not set, we set it
    // This will be fetched by the GRPCServerSingleton
    process.env.DAPR_INTERNAL_SERVER_PORT = this.daprPort;
    
    // // Get the App Port as set in the Dapr constructor
    // const randomPort = Math.floor(Math.random() * (20000 - 10000 + 1)) + 10000;
    // const appPort = parseInt(process.env.DAPR_INTERNAL_SERVER_PORT || "", 10) || randomPort;

    this.pubsub = new DaprServerPubSub(this.daprServer);
    this.binding = new DaprServerBinding(this.daprServer);
    this.invoker = new DaprServerInvoker(this.daprServer);
    this.actor = new DaprServerActor(this.daprServer);
  }

  async startServer() {
    await this.daprServer.startServer(this.daprHost, this.daprInternalServerPort.toString());
  }
}