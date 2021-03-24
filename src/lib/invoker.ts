import fetch from 'node-fetch';
import ResponseUtil from '../utils/Response.util';
import { TypeDaprInvokerCallback } from '../types/DaprInvokerCallback.type';
import { InvokerListenOptionsType } from '../types/InvokerListenOptions.type';
import { InvokerListenOptionsMethod } from '../enum/InvokerListenOptionsMethod.enum';
import WebServerSingleton from '../singleton/WebServerSingleton';

export default class DaprInvoker {
  daprUrl: string;

  constructor(daprUrl: string) {
    this.daprUrl = daprUrl;
  }

  async listen(methodName: string, cb: TypeDaprInvokerCallback, options: InvokerListenOptionsType = {}) {
    const expressMethod: InvokerListenOptionsMethod = options?.method?.toLowerCase() as InvokerListenOptionsMethod || InvokerListenOptionsMethod.GET;

    console.log(`Listening on ${expressMethod.toUpperCase()} /${methodName}`);
    const server = await WebServerSingleton.getInstance().getServer();
    server[expressMethod](`/${methodName}`, async (req, res) => {
      await cb(req, res);

      // Make sure we close the request after the callback
      if (!res.writableEnded) {
        return res.json({ closed: true });
      }
    });
  }

  async invoke(appId: string, methodName: string, data: object = {}) {
    const res = await fetch(`${this.daprUrl}/invoke/${appId}/method/${methodName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    return ResponseUtil.handleResponse(res);
  }
}
