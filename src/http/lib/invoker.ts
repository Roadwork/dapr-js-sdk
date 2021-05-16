import fetch from 'node-fetch';
import ResponseUtil from '../utils/Response.util';
import { TypeDaprInvokerCallback } from '../types/DaprInvokerCallback.type';
import { InvokerListenOptionsType } from '../types/InvokerListenOptions.type';
import { InvokerListenOptionsMethod } from '../enum/InvokerListenOptionsMethod.enum';
import WebServerSingleton from './WebServer/WebServerSingleton';

// https://docs.dapr.io/reference/api/service_invocation_api/
export default class DaprInvoker {
  daprUrl: string;

  constructor(daprUrl: string) {
    this.daprUrl = daprUrl;
  }

  async listen(methodName: string, cb: TypeDaprInvokerCallback, options: InvokerListenOptionsType = {}) {
    const serverMethod: InvokerListenOptionsMethod = options?.method?.toLowerCase() as InvokerListenOptionsMethod || InvokerListenOptionsMethod.GET;

    const server = await WebServerSingleton.getServer();
    server[serverMethod](`/${methodName}`, async (req, res) => {
      await cb(req, res);

      // Make sure we close the request after the callback
      if (!res.writableEnded) {
        return res.end(JSON.stringify({ closed: true }));
      }
    });
    
    console.log(`Listening on ${serverMethod.toUpperCase()} /${methodName}`);
  }

  async invoke(appId: string, methodName: string, data: object = {}, method: InvokerListenOptionsMethod = InvokerListenOptionsMethod.GET) {
    const fetchOptions = {
      method
    };

    if (method !== InvokerListenOptionsMethod.GET) {
      // @ts-ignore
      fetchOptions.headers = {
        'Content-Type': 'application/json'
      };
    }

    if (method !== InvokerListenOptionsMethod.GET && data !== {}) {
      // @ts-ignore
      fetchOptions.body = JSON.stringify(data);
    }

    const res = await fetch(`${this.daprUrl}/invoke/${appId}/method/${methodName}`, fetchOptions);
    return ResponseUtil.handleResponse(res);
  }
}
