import express from 'express';
import TypeDaprPubSub from './pubsub.type';
export default class DaprPubSub {
    url: string;
    urlDapr: string;
    port: number;
    express: express.Application;
    constructor(express: express.Application, daprUrl: string, daprPort: number);
    publish(pubSubName: string, topic: string, body?: object): Promise<void>;
    subscribe(pubSubName: string, topic: string, cb: TypeDaprPubSub): void;
}
