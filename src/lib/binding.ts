// https://github.com/dapr/docs/blob/master/reference/api/state_api.md

import fetch from 'node-fetch';
import express from 'express';
import HttpStatusCode from '../enum/HttpStatusCode.enum';
import ResponseUtil from '../utils/Response.util';

type FunctionDaprInputCallback = (data: object) => Promise<any>;
export default class DaprBinding {
  daprUrl: string;
  express: express.Application;

  constructor(express: express.Application, daprUrl: string) {
    this.daprUrl = daprUrl;
    this.express = express;
  }

  // Receive an input from an external system
  receive(bindingName: string, cb: FunctionDaprInputCallback) {
    this.express.use(express.json()); // Accept dapr format

    this.express.post(`/${bindingName}`, async (req, res) => {
      req.setTimeout(60 * 1000); // amount of seconds to wait for the request CB to finalize
      
      try {
        await cb(req?.body); 
      } catch (e) {
        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(JSON.stringify({
          error: "COULD_NOT_PROCESS_CALLBACK",
          error_msg: `Something happened while processing the input binding callback - ${e.message}`
        }))
      }

      // we send the processing status after we are done processing
      // note: if the callback takes longer than the expected wait time in the queue, it might be that this never gets called
      // @todo: can we do this cleaner without sending the response directly?
      return res.status(HttpStatusCode.OK).send(); 
    });
  }

  // Send an event to an external system
  async send(bindingName: string, data: any, metadata: object): Promise<object> {
    const res = await fetch(`${this.daprUrl}/bindings/${bindingName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        operation: 'create',
        data,
        metadata
      }),
    });

    return ResponseUtil.handleResponse(res);
  }
}
