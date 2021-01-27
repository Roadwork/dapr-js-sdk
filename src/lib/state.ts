// https://github.com/dapr/docs/blob/master/reference/api/state_api.md

import fetch from 'node-fetch';
import express from 'express';
import * as ErrorUtil from '../utils/Error.util';
import ResponseUtil from '../utils/Response.util';

interface IKeyValuePair {
  key: string;
  value: string;
}

export default class DaprState {
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

  async save(storeName: string, stateObjects: IKeyValuePair[]): Promise<object> {
    const res = await fetch(`${this.urlDapr}/state/${storeName}`, {
      method: 'POST',
      body: JSON.stringify(stateObjects),
    });
    return ResponseUtil.handleResponse(res);
  }

  async get(storeName: string, key: string): Promise<object> {
    const res = await fetch(`${this.urlDapr}/state/${storeName}/${key}`);
    return ResponseUtil.handleResponse(res);
  }

  async delete(storeName: string, key: string): Promise<number> {
    const req = await fetch(`${this.urlDapr}/state/${storeName}/${key}`, {
      method: 'DELETE',
    });

    return req.status;
  }
}
