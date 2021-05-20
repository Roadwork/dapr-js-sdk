import { InvokeBindingRequest, InvokeBindingResponse } from '../proto/dapr/proto/runtime/v1/dapr_pb';
import { TypeDaprBindingCallback } from '../types/DaprBindingCallback.type';
import GRPCClientSingleton from './GRPCClient/GRPCClientSingleton';
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
  // @todo: should pass the metadata object
  // @todo: should return a specific typed Promise<TypeBindingResponse> instead of Promise<object>
  async send(bindingName: string, operation: string, data: any, metadata: object = {}): Promise<object> {
    const msgService = new InvokeBindingRequest();
    msgService.setName(bindingName);
    msgService.setOperation(operation);
    msgService.setData(Buffer.from(JSON.stringify(data), "utf-8"));

    return new Promise(async (resolve, reject) => {
      const client = await GRPCClientSingleton.getClient();
      client.invokeBinding(msgService, (err, res: InvokeBindingResponse) => {
        if (err) {
          return reject(err);
        }

        // https://docs.dapr.io/reference/api/bindings_api/#payload
        return resolve({
          data: res.getData(),
          metadata: res.getMetadataMap(),
          operation
        });
      });
    })



    // // InvokeServiceRequest represents the request message for Service invocation.
    // const msgInvokeService = new InvokeServiceRequest();
    // msgInvokeService.setId(appId);

    // const httpExtension = new HTTPExtension();
    // httpExtension.setVerb(HttpVerbUtil.convertHttpVerbStringToNumber(method));

    // const msgSerialized = new Any();
    // msgSerialized.setValue(Buffer.from(JSON.stringify(data), "utf-8"));

    // const msgInvoke = new InvokeRequest();
    // msgInvoke.setMethod(methodName);
    // msgInvoke.setHttpExtension(httpExtension);
    // msgInvoke.setData(msgSerialized);
    // msgInvoke.setContentType("application/json");

    // msgInvokeService.setMessage(msgInvoke);

    // return new Promise(async (resolve, reject) => {
    //   const client = await GRPCClientSingleton.getClient();
    //   client.invokeService(msgInvokeService, (err, res: InvokeResponse) => {
    //     if (err) {
    //       return reject(err);
    //     }

    //     // const res = await fetch(`${this.daprUrl}/invoke/${appId}/method/${methodName}`, fetchOptions);
    //     // return ResponseUtil.handleResponse(res);
    //     const resContentType = res.getContentType();
    //     const resData = Buffer.from((res.getData() as Any).getValue()).toString();

    //     return resolve({
    //       body: resData,
    //       query: httpExtension.getQuerystring(),
    //       metadata: {
    //         contentType: resContentType
    //       }
    //     });
    //   })
    // })
  }
}
