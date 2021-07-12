import ResponseUtil from '../../utils/Response.util';
import IClientSecretStrategy from '../IClientSecretStrategy';
import HTTPClient from './HTTPClient';

// https://docs.dapr.io/reference/api/secrets_api/
export default class DaprClientSecret implements IClientSecretStrategy {
  client: HTTPClient;

  constructor(client: HTTPClient) {
    this.client = client;
  }

  async get(secretStoreName: string, key: string, metadata: string = ""): Promise<object> {
    const res = await this.client.execute(`/secrets/${secretStoreName}/${key}${metadata ? `?${metadata}` : ""}`);
    return ResponseUtil.handleResponse(res);
  }

  async getBulk(secretStoreName: string): Promise<object> {
    const res = await this.client.execute(`/secrets/${secretStoreName}/bulk`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    });

    return ResponseUtil.handleResponse(res);
  }
}
