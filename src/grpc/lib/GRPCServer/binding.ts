import { TypeDaprBindingCallback } from '../../types/DaprBindingCallback.type';
import GRPCServer from './GRPCServer';

// https://docs.dapr.io/reference/api/bindings_api/
export default class DaprBinding {
  server: GRPCServer;

  constructor(server: GRPCServer) {
      this.server = server;
  }
  
  // Receive an input from an external system
  async receive(bindingName: string, cb: TypeDaprBindingCallback) {
    console.log(`Registering onBindingInput Handler: Binding = ${bindingName}`);
    this.server.getServerImpl().registerInputBindingHandler(bindingName, cb);
  }
}