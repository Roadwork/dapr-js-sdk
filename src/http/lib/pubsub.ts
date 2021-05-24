import fetch from 'node-fetch';
import WebServerSingleton from "./WebServer/WebServerSingleton";
import { TypeDaprPubSubCallback } from '../types/DaprPubSubCallback.type';

// https://docs.dapr.io/reference/api/pubsub_api/
export default class DaprPubSub {
  daprUrl: string;

  constructor(daprUrl: string) {
    this.daprUrl = daprUrl;
  }

  async publish(pubSubName: string, topic: string, body: object = {}): Promise<number> {
    const res = await fetch(`${this.daprUrl}/publish/${pubSubName}/${topic}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // Returns 200 or 500
    return res.status;
  }

  async subscribe(pubsubName: string, topic: string, cb: TypeDaprPubSubCallback, route: string = "") {
    const server = await WebServerSingleton.getServer();
    const serverImpl = await WebServerSingleton.getServerImpl();

    if (!route) {
      route = `route-${pubsubName}-${topic}`;
    }

    // Register the handler
    await serverImpl.registerPubSubSubscriptionRoute(pubsubName, topic, route);

    server.post(`/${route}`, async (req, res) => {
      // Process our callback
      await cb(req?.body);

      // Let Dapr know that the message was processed correctly
      // console.log(`[Dapr API][PubSub][route-${topic}] Ack'ing the message`);
      return res.send({ success: true });
    });
  }
}