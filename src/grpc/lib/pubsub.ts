import { PublishEventRequest } from "../proto/dapr/proto/runtime/v1/dapr_pb";
import { TypeDaprPubSubCallback } from "../types/DaprPubSubCallback.type";
import GRPCClientSingleton from "./GRPCClient/GRPCClientSingleton";
import GRPCServerSingleton from "./GRPCServer/GRPCServerSingleton";

// https://docs.dapr.io/reference/api/pubsub_api/
export default class DaprPubSub {
  // @todo: should return a specific typed Promise<TypePubSubPublishResponse> instead of Promise<any>
  async publish(pubSubName: string, topic: string, data: object = {}): Promise<any> {
    const msgService = new PublishEventRequest();
    msgService.setPubsubName(pubSubName);
    msgService.setTopic(topic);
    msgService.setData(Buffer.from(JSON.stringify(data), "utf-8"));

    return new Promise(async (resolve, reject) => {
      const client = await GRPCClientSingleton.getClient();
      client.publishEvent(msgService, (err, res) => {
        if (err) {
          return reject(err);
        }

        // https://docs.dapr.io/reference/api/pubsub_api/#expected-http-response
        return resolve({});
      });
    });
  }

  async subscribe(pubSubName: string, topic: string, cb: TypeDaprPubSubCallback) {
    const server = await GRPCServerSingleton.getServerImpl();
    console.log(`Registering onTopicEvent Handler: PubSub = ${pubSubName}; Topic = ${topic}`);
    server.registerPubSubSubscriptionHandler(pubSubName, topic, cb);
  }
}
