import ResponseUtil from '../../utils/Response.util';
import { HttpMethod } from '../../enum/HttpMethod.enum';
import WebClient from './WebClient';

// https://docs.dapr.io/reference/api/service_invocation_api/
export default class DaprClientInvoker {
  client: WebClient;

  constructor(client: WebClient) {
    this.client = client;
  }

  async invoke(appId: string, methodName: string, method: HttpMethod = HttpMethod.GET, data: object = {}) {
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
