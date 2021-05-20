import { TypeDaprPubSubCallback } from "../types/DaprPubSubCallback.type";
import GRPCServerSingleton from "./GRPCServer/GRPCServerSingleton";

// https://docs.dapr.io/reference/api/pubsub_api/
export default class DaprPubSub {
  async publish(pubSubName: string, topic: string, body: object = {}): Promise<number> {
    // const res = await fetch(`${this.daprUrl}/publish/${pubSubName}/${topic}`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(body),
    // });

    // // Returns 200 or 500
    // return res.status;
    return 200;
  }

  async subscribe(pubSubName: string, topic: string, cb: TypeDaprPubSubCallback) {
    const server = await GRPCServerSingleton.getServerImpl();
    console.log(`Registering onTopicEvent Handler: PubSub = ${pubSubName}; Topic = ${topic}`);
    server.registerPubSubSubscriptionHandler(pubSubName, topic, cb);
  }
}
