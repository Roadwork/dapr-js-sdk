import { TypeDaprPubSubCallback } from '../../types/DaprPubSubCallback.type';
import WebServer from './WebServer';

// https://docs.dapr.io/reference/api/pubsub_api/
export default class DaprServerPubSub {
  server: WebServer;

  constructor(server: WebServer) {
      this.server = server;
  }

  async subscribe(pubsubName: string, topic: string, cb: TypeDaprPubSubCallback, route: string = "") {
    if (!route) {
      route = `route-${pubsubName}-${topic}`;
    }

    // Register the handler
    await this.server.getServerImpl().registerPubSubSubscriptionRoute(pubsubName, topic, route);

    this.server.getServer().post(`/${route}`, async (req, res) => {
      // Process our callback
      await cb(req?.body);

      // Let Dapr know that the message was processed correctly
      // console.log(`[Dapr API][PubSub][route-${topic}] Ack'ing the message`);
      return res.send({ success: true });
    });
  }
}