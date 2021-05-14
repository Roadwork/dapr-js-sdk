import { TypeDaprPubSub } from '../types/DaprPubSub.type';
export default class DaprPubSub {
    daprUrl: string;
    constructor(daprUrl: string);
    publish(pubSubName: string, topic: string, body?: object): Promise<number>;
    subscribe(pubSubName: string, topic: string, cb: TypeDaprPubSub): Promise<void>;
}
