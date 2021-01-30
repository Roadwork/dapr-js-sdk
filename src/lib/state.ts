// https://github.com/dapr/docs/blob/master/reference/api/state_api.md

import fetch from 'node-fetch';
import express from 'express';
import ResponseUtil from '../utils/Response.util';

interface IKeyValuePair {
  key: string;
  value: string;
}

export default class DaprState {
  daprUrl: string;
  express: express.Application;

  constructor(express: express.Application, daprUrl: string) {
    this.daprUrl = daprUrl;
    this.express = express;
  }

  async save(storeName: string, stateObjects: IKeyValuePair[]): Promise<object> {
    const res = await fetch(`${this.daprUrl}/state/${storeName}`, {
      method: 'POST',
      body: JSON.stringify(stateObjects),
    });
    return ResponseUtil.handleResponse(res);
  }

  async get(storeName: string, key: string): Promise<object> {
    const res = await fetch(`${this.daprUrl}/state/${storeName}/${key}`);
    return ResponseUtil.handleResponse(res);
  }

  async delete(storeName: string, key: string): Promise<number> {
    const req = await fetch(`${this.daprUrl}/state/${storeName}/${key}`, {
      method: 'DELETE',
    });

    return req.status;
  }
}
