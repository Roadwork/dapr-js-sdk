import { TypeDaprBindingCallback } from '../types/DaprBindingCallback.type';
import GRPCServerSingleton from './GRPCServer/GRPCServerSingleton';

// https://docs.dapr.io/reference/api/bindings_api/
export default class DaprBinding {
  // Receive an input from an external system
  async receive(bindingName: string, cb: TypeDaprBindingCallback) {
    const server = await GRPCServerSingleton.getServerImpl();
    console.log(`Registering onBindingInput Handler: Binding = ${bindingName}`);
    server.registerInputBindingHandler(bindingName, cb);
  }

  // Send an event to an external system
  async send(bindingName: string, operation: string, data: any, metadata: object): Promise<object> {
    // const res = await fetch(`${this.daprUrl}/bindings/${bindingName}`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     operation,
    //     data,
    //     metadata
    //   }),
    // });

    // return ResponseUtil.handleResponse(res);
    return {};
  }
}
