import ResponseUtil from '../../utils/Response.util';
import IClientBindingStrategy from '../IClientBindingStrategy';
import HTTPClient from './HTTPClient';

// https://docs.dapr.io/reference/api/bindings_api/
type FunctionDaprInputCallback = (data: any) => Promise<any>;

export default class DaprClientBinding implements IClientBindingStrategy {
  client: HTTPClient;

  constructor(client: HTTPClient) {
    this.client = client;
  }

  // Send an event to an external system
  async send(bindingName: string, operation: string, data: any, metadata: object = {}): Promise<object> {
    const res = await this.client.execute(`/bindings/${bindingName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        operation,
        data,
        metadata
      }),
    });

    return ResponseUtil.handleResponse(res);
  }
}
