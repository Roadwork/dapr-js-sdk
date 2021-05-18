import fetch from 'node-fetch';
import ResponseUtil from '../utils/Response.util';
import { TypeDaprInvokerCallback } from '../types/DaprInvokerCallback.type';
import { InvokerListenOptionsType } from '../types/InvokerListenOptions.type';
import { HttpMethod } from '../enum/HttpMethod.enum';
import WebServerSingleton from './GRPCServer/GRPCServerSingleton';

import { UntypedServiceImplementation, ServiceDefinition } from '@grpc/grpc-js';
import DaprAppCallbackServices, { IAppCallbackServer } from "../proto/dapr/proto/runtime/v1/appcallback_grpc_pb";
import { HTTPExtension, InvokeRequest, InvokeResponse } from '../proto/dapr/proto/common/v1/common_pb';
import { DaprClient } from '../proto/dapr/proto/runtime/v1/dapr_grpc_pb';
import GRPCServerSingleton from './GRPCServer/GRPCServerSingleton';
import { InvokeServiceRequest } from '../proto/dapr/proto/runtime/v1/dapr_pb';
import { Any } from '../proto/google/protobuf/any_pb';

// https://docs.dapr.io/reference/api/service_invocation_api/
export default class DaprInvoker {
  // grpcClient: DaprClient;

  // constructor(grpcClient: DaprClient) {
  //   this.grpcClient = grpcClient;
  // }

  async listen(methodName: string, cb: TypeDaprInvokerCallback, options: InvokerListenOptionsType = {}) {
    const serverMethod: HttpMethod = options?.method?.toLowerCase() as HttpMethod || HttpMethod.GET;

    const server = await WebServerSingleton.getServer();

    // const IAppCallbackServer = DaprGrpc.appCallbackServices.AppCallbackService;
    // server.addService(DaprGrpc.appCallbackServices.AppCallbackService as IAppCallbackServer, {

    // })
    
    // server[serverMethod.toString()](`/${methodName}`, async (req, res) => {
    //   await cb(req, res);

    //   // Make sure we close the request after the callback
    //   if (!res.writableEnded) {
    //     return res.end(JSON.stringify({ closed: true }));
    //   }
    // });

    console.log(`Listening on ${serverMethod.toUpperCase()} /${methodName}`);
  }

  async invoke(appId: string, methodName: string, method: HttpMethod = HttpMethod.GET, data: object = {}) {
    const fetchOptions = {
      method
    };

    if (method !== HttpMethod.GET) {
      // @ts-ignore
      fetchOptions.headers = {
        'Content-Type': 'application/json'
      };
    }

    if (method !== HttpMethod.GET && data !== {}) {
      // @ts-ignore
      fetchOptions.body = JSON.stringify(data);
    }

    // InvokeServiceRequest represents the request message for Service invocation.
    const msgInvokeService = new InvokeServiceRequest();
    msgInvokeService.setId(appId);

    const httpExtension = new HTTPExtension();
    httpExtension.setVerb(HTTPExtension.Verb.POST);

    const msgSerialized = new Any();
    // msgSerialized.setValue(JSON.stringify(data));
    msgSerialized.setValue("test");

    const msgInvoke = new InvokeRequest();
    msgInvoke.setHttpExtension(httpExtension);
    msgInvoke.setData(msgSerialized);

    msgInvokeService.setMessage(msgInvoke);

    return new Promise(async (resolve, reject) => {
      const client = await GRPCServerSingleton.getClient();
      client.invokeService(msgInvokeService, (err, res: InvokeResponse) => {
        if (err) {
          return reject(err);
        }
        
        // const res = await fetch(`${this.daprUrl}/invoke/${appId}/method/${methodName}`, fetchOptions);
        // return ResponseUtil.handleResponse(res);
        return resolve(res);
      })
    })
  }
}
