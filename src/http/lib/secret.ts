import fetch from 'node-fetch';
import ResponseUtil from '../utils/Response.util';

// https://docs.dapr.io/reference/api/secrets_api/
export default class DaprSecret {
  daprUrl: string;

  constructor(daprUrl: string) {
    this.daprUrl = daprUrl;
  }

  async get(secretStoreName: string, key: string, metadata: string = ""): Promise<object> {
    const res = await fetch(`${this.daprUrl}/secrets/${secretStoreName}/${key}${metadata ? `?${metadata}` : ""}`);
    return ResponseUtil.handleResponse(res);
  }

  async getBulk(secretStoreName: string): Promise<object> {
    const res = await fetch(`${this.daprUrl}/secrets/${secretStoreName}/bulk`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    });

    return ResponseUtil.handleResponse(res);
  }
}
