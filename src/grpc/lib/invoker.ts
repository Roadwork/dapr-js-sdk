import { TypeDaprInvokerCallback } from '../types/DaprInvokerCallback.type';
import { InvokerListenOptionsType } from '../types/InvokerListenOptions.type';
import { HttpMethod } from '../enum/HttpMethod.enum';
import { HTTPExtension, InvokeRequest, InvokeResponse } from '../proto/dapr/proto/common/v1/common_pb';
import { InvokeServiceRequest } from '../proto/dapr/proto/runtime/v1/dapr_pb';
import { Any } from '../proto/google/protobuf/any_pb';

import GRPCServerSingleton from './GRPCServer/GRPCServerSingleton';
import GRPCClientSingleton from './GRPCClient/GRPCClientSingleton';

import * as HttpVerbUtil from "../utils/HttpVerb.util";

// https://docs.dapr.io/reference/api/service_invocation_api/
export default class DaprInvoker {
  async listen(methodName: string, cb: TypeDaprInvokerCallback, options: InvokerListenOptionsType = {}) {
    const httpMethod: HttpMethod = options?.method?.toLowerCase() as HttpMethod || HttpMethod.GET;
    const server = await GRPCServerSingleton.getServerImpl();
    console.log(`Registering onInvoke Handler ${httpMethod} /${methodName}`);
    server.registerOnInvokeHandler(httpMethod, methodName, cb);
  }

  // @todo: should return a specific typed Promise<TypeInvokerInvokeResponse> instead of Promise<nothing>
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
    httpExtension.setVerb(HttpVerbUtil.convertHttpVerbStringToNumber(method));

    const msgSerialized = new Any();
    msgSerialized.setValue(Buffer.from(JSON.stringify(data), "utf-8"));

    const msgInvoke = new InvokeRequest();
    msgInvoke.setMethod(methodName);
    msgInvoke.setHttpExtension(httpExtension);
    msgInvoke.setData(msgSerialized);
    msgInvoke.setContentType("application/json");

    msgInvokeService.setMessage(msgInvoke);

    return new Promise(async (resolve, reject) => {
      const client = await GRPCClientSingleton.getClient();
      client.invokeService(msgInvokeService, (err, res: InvokeResponse) => {
        if (err) {
          return reject(err);
        }
        
        // const res = await fetch(`${this.daprUrl}/invoke/${appId}/method/${methodName}`, fetchOptions);
        // return ResponseUtil.handleResponse(res);
        const resContentType = res.getContentType();
        const resData = Buffer.from((res.getData() as Any).getValue()).toString();

        return resolve({
          body: resData,
          query: httpExtension.getQuerystring(),
          metadata: {
            contentType: resContentType
          }
        });
      })
    })
  }
}
