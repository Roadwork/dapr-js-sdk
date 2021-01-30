import fetch from 'node-fetch';
import express from 'express';
import TypeDaprInvoke from './invoke.type';
import * as ErrorUtil from '../utils/Error.util';
import ResponseUtil from '../utils/Response.util';

export default class DaprInvoke {
  daprUrl: string;
  express: express.Application;

  constructor(express: express.Application, daprUrl: string) {
    this.daprUrl = daprUrl;
    this.express = express;
  }

  async receive(endpoint: string, cb: TypeDaprInvoke) {
    console.log(`[Dapr API][Invoke] Registering Route: POST ${endpoint}`);

    this.express.post(endpoint, async (req, res) => {
      console.log(`[Dapr API][Invoke][route-${endpoint}] Handling incoming message`);

      try {
        // await cb, this will also handle the res.json or others
        await cb(req, res);
      } catch (e) {
        // If error, we want to throw it in a clean way
        return res.status(500).json(e.message);
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
