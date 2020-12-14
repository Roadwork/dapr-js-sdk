import fetch from 'node-fetch';
import express from 'express';
import TypeDaprInvoke from './invoke.type';

export default class DaprInvoke {
  url: string;
  urlDapr: string;
  port: number;
  express: express.Application;

  constructor(express: express.Application, daprUrl: string, daprPort: number) {
    this.url = daprUrl || '127.0.0.1';
    this.port = daprPort || 3500;
    this.express = express;

    if (!this.url.startsWith('http://') && !this.url.startsWith('https://')) {
      this.url = `http://${this.url}`;
    }

    this.urlDapr = `${this.url}:${this.port}/v1.0`;
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
    const req = await fetch(`${this.urlDapr}/invoke/${appId}/method/${methodName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    let json;

    switch (req.status) {
      case 200:
        json = await req.json();
        return json;
        break;
      case 204:
        return null;
        break;
      case 400:
        json = await req.json();
        throw new Error(JSON.stringify(json));
        break;
      case 500:
        json = await req.json();
        throw new Error(JSON.stringify(json));
        break;
      default:
        return null;
    }
  }
}
