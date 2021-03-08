// https://github.com/dapr/docs/blob/master/reference/api/state_api.md

import fetch from 'node-fetch';
import express from 'express';
import ResponseUtil from '../utils/Response.util';
import { IKeyValuePair } from '../types/KeyValuePair.type';
import { IOperation } from '../types/Operation.type';
import { IRequestMetadata } from '../types/RequestMetadata.type';

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
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(stateObjects),
    });
    return ResponseUtil.handleResponse(res);
  }

  async get(storeName: string, key: string): Promise<object> {
    const res = await fetch(`${this.daprUrl}/state/${storeName}/${key}`);
    return ResponseUtil.handleResponse(res);
  }

  async get_bulk(storeName: string, keys: Array<string>, parallelism: number = 10, metadata: string = ""): Promise<object> {
    const res = await fetch(`${this.daprUrl}/state/${storeName}/bulk${metadata ? `?${metadata}` : ""}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        keys,
        parallelism // the number of parallel operations executed on the state store for a get operation
      })
    });

    return ResponseUtil.handleResponse(res);
  }

  async delete(storeName: string, key: string): Promise<number> {
    const req = await fetch(`${this.daprUrl}/state/${storeName}/${key}`, {
      method: 'DELETE',
    });

    return req.status;
  }

  async transaction(storeName: string, operations: Array<IOperation> = [], metadata: IRequestMetadata | null = null): Promise<object> {
    const res = await fetch(`${this.daprUrl}/state/${storeName}/transaction`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        operations,
        metadata
      })
    });

    return ResponseUtil.handleResponse(res);
  }
}
