// https://github.com/dapr/docs/blob/master/reference/api/state_api.md

import fetch from 'node-fetch';
import express from 'express';
import HttpStatusCode from '../enum/HttpStatusCode.enum';
import ResponseUtil from '../utils/Response.util';

type FunctionDaprInputCallback = (data: object) => Promise<any>;
export default class DaprBinding {
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

  // Receive an input from an external system
  receive(bindingName: string, cb: FunctionDaprInputCallback) {
    // app.use(express.json({ type: 'application/*+json' })); // Accept dapr format
    this.express.use(express.json()); // Accept dapr format

    this.express.post(`/${bindingName}`, async (req, res) => {
      req.setTimeout(60 * 1000); // amount of seconds to wait for the request CB to finalize
      
      await cb(req?.body); 

      // we send the processing status after we are done processing
      // note: if the callback takes longer than the expected wait time in the queue, it might be that this never gets called
      // @todo: can we do this cleaner without sending the response directly?
      res.status(HttpStatusCode.OK).send(); 
    });
  }

  // Send an event to an external system
  async send(bindingName: string, data: object): Promise<object> {
    const res = await fetch(`${this.urlDapr}/bindings/${bindingName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data,
        operation: 'create',
      }),
    });

    return ResponseUtil.handleResponse(res);
  }
}
