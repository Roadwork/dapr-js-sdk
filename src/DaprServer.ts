import GRPCServer from './GRPCServer/GRPCServer';

import GRPCServerPubSub from './GRPCServer/pubsub';
import GRPCServerBinding from './GRPCServer/binding';
import GRPCServerInvoker from './GRPCServer/invoker';

export default class DaprServer {
  daprServer: GRPCServer;

  pubsub: GRPCServerPubSub;
  binding: GRPCServerBinding;
  invoker: GRPCServerInvoker;

  constructor(serverHost: string = "127.0.0.1", serverPort: string = "50050") {
    this.daprServer = new GRPCServer(serverHost, serverPort);

    this.pubsub = new GRPCServerPubSub(this.daprServer);
    this.binding = new GRPCServerBinding(this.daprServer);
    this.invoker = new GRPCServerInvoker(this.daprServer);
  }

  async startServer() {
    await this.daprServer.startServer();
  }
}