import ResponseUtil from '../../utils/Response.util';
import { HttpMethod } from '../../enum/HttpMethod.enum';
import HTTPClient from './HTTPClient';
import IClientInvokerStrategy from '../IClientInvokerStrategy';

// https://docs.dapr.io/reference/api/service_invocation_api/
export default class DaprClientInvoker implements IClientInvokerStrategy {
  client: HTTPClient;

  constructor(client: HTTPClient) {
    this.client = client;
  }

  async invoke(appId: string, methodName: string, method: HttpMethod = HttpMethod.GET, data: object = {}): Promise<object> {
    const fetchOptions = {
      method
    };

    if (method !== HttpMethod.GET) {
      // @ts-ignore
      fetchOptions.headers = {
        'Content-Type': 'application/json'
      };
    }

    if (method !== HttpMethod.GET && data !== {}) {
      // @ts-ignore
      fetchOptions.body = JSON.stringify(data);
    }

    const res = await this.client.execute(`/invoke/${appId}/method/${methodName}`, fetchOptions);
    return ResponseUtil.handleResponse(res);
  }
}
