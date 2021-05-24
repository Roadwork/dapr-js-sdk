import WebClient from './WebClient';

// https://docs.dapr.io/reference/api/pubsub_api/
export default class DaprClientPubSub {
  client: WebClient;

  constructor(client: WebClient) {
    this.client = client;
  }

  async publish(pubSubName: string, topic: string, body: object = {}): Promise<number> {
    const res = await this.client.execute(`/publish/${pubSubName}/${topic}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // Returns 200 or 500
    return res.status;
  }
}