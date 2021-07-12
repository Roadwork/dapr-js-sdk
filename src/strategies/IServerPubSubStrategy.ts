import { TypeDaprPubSubCallback } from "../types/DaprPubSubCallback.type";

export default interface IServerPubSubStrategy {
    subscribe(pubSubName: string, topic: string, cb: TypeDaprPubSubCallback): Promise<void>;
}