import fetch from 'node-fetch';
import ResponseUtil from '../utils/Response.util';
import { IKeyValuePair } from '../types/KeyValuePair.type';
import { OperationType } from '../types/Operation.type';
import { IRequestMetadata } from '../types/RequestMetadata.type';

// https://docs.dapr.io/reference/api/state_api/
export default class DaprState {
  daprUrl: string;

  constructor(daprUrl: string) {
    this.daprUrl = daprUrl;
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

  async getBulk(storeName: string, keys: string[], parallelism: number = 10, metadata: string = ""): Promise<object> {
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

  async transaction(storeName: string, operations: OperationType[] = [], metadata: IRequestMetadata | null = null): Promise<object> {
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
