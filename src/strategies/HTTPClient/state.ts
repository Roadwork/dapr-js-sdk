import ResponseUtil from '../../utils/Response.util';
import { IKeyValuePair } from '../../types/KeyValuePair.type';
import { OperationType } from '../../types/Operation.type';
import { IRequestMetadata } from '../../types/RequestMetadata.type';
import HTTPClient from './HTTPClient';
import IClientStateStrategy from '../IClientStateStrategy';
import HttpStatusCode from '../../enum/HttpStatusCode.enum';

// https://docs.dapr.io/reference/api/state_api/
export default class DaprClientState implements IClientStateStrategy {
  client: HTTPClient;

  constructor(client: HTTPClient) {
    this.client = client;
  }

  async save(storeName: string, stateObjects: IKeyValuePair[]): Promise<void> {
    const res = await this.client.execute(`/state/${storeName}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(stateObjects),
    });

    switch (res.status) {
      case HttpStatusCode.NO_CONTENT:
        return;
      case HttpStatusCode.BAD_REQUEST:
        throw new Error(JSON.stringify({
          error: "STATE_STORE_PROBLEM",
          error_msg: "The state store is missing or misconfigured or malformed request"
        }));
      case HttpStatusCode.INTERNAL_SERVER_ERROR:
        throw new Error(JSON.stringify({
          error: "STATE_STORE_COULD_NOT_SAVE",
          error_msg: "Failed to save the state"
        }));
      default:
        throw new Error(JSON.stringify({
          error: "UNKNOWN",
          error_msg: `An unknown problem occured and we got the status ${res.statusCode} with response ${res}`
        }));
    }
  }

  async get(storeName: string, key: string): Promise<object> {
    const res = await this.client.execute(`/state/${storeName}/${key}`);
    return ResponseUtil.handleResponse(res);
  }

  async getBulk(storeName: string, keys: string[], parallelism: number = 10, metadata: string = ""): Promise<object> {
    const res = await this.client.execute(`/state/${storeName}/bulk${metadata ? `?${metadata}` : ""}`, {
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

  async delete(storeName: string, key: string): Promise<void> {
    const res = await this.client.execute(`/state/${storeName}/${key}`, {
      method: 'DELETE',
    });

    switch (res.status) {
      case HttpStatusCode.NO_CONTENT:
        return;
      case HttpStatusCode.BAD_REQUEST:
        throw new Error(JSON.stringify({
          error: "STATE_STORE_PROBLEM",
          error_msg: "The state store is missing or misconfigured or malformed request"
        }));
      case HttpStatusCode.INTERNAL_SERVER_ERROR:
        throw new Error(JSON.stringify({
          error: "STATE_STORE_COULD_NOT_DELETE",
          error_msg: "Failed to delete the state"
        }));
      default:
        throw new Error(JSON.stringify({
          error: "UNKNOWN",
          error_msg: `An unknown problem occured and we got the status ${res.statusCode} with response ${res}`
        }));
    }
  }

  async transaction(storeName: string, operations: OperationType[] = [], metadata: IRequestMetadata | null = null): Promise<void> {
    const res = await this.client.execute(`/state/${storeName}/transaction`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        operations,
        metadata
      })
    });

    switch (res.status) {
      case HttpStatusCode.NO_CONTENT:
        return;
      case HttpStatusCode.BAD_REQUEST:
        throw new Error(JSON.stringify({
          error: "STATE_STORE_PROBLEM",
          error_msg: "The state store is missing or misconfigured or malformed request"
        }));
      case HttpStatusCode.INTERNAL_SERVER_ERROR:
        throw new Error(JSON.stringify({
          error: "STATE_STORE_TRANSACTION_FAILED",
          error_msg: "Failed to execute the transaction"
        }));
      default:
        throw new Error(JSON.stringify({
          error: "UNKNOWN",
          error_msg: `An unknown problem occured and we got the status ${res.statusCode} with response ${res}`
        }));
    }
  }
}
