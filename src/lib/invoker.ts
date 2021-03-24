import fetch from 'node-fetch';
import express from 'express';
import ResponseUtil from '../utils/Response.util';
import { TypeDaprInvokerCallback } from '../types/DaprInvokerCallback.type';
import { InvokerListenOptionsType } from '../types/InvokerListenOptions.type';
import { InvokerListenOptionsMethod } from '../enum/InvokerListenOptionsMethod.enum';

export default class DaprInvoker {
  daprUrl: string;
  express: express.Application;

  constructor(express: express.Application, daprUrl: string) {
    this.daprUrl = daprUrl;
    this.express = express;
  }

  async listen(methodName: string, cb: TypeDaprInvokerCallback, options: InvokerListenOptionsType = {}) {
    this.express.use(express.json({ type: 'application/*+json' }));

    const expressMethod: InvokerListenOptionsMethod = options?.method?.toLowerCase() as InvokerListenOptionsMethod || InvokerListenOptionsMethod.GET;

    console.log(`Listening on ${expressMethod.toUpperCase()} /${methodName}`);
    this.express[expressMethod](`/${methodName}`, async (req: express.Request, res: express.Response) => {
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
