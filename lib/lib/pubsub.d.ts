import express from 'express';
import { TypeDaprPubSub } from '../types/DaprPubSub.type';
export default class DaprPubSub {
    daprUrl: string;
    express: express.Application;
    constructor(express: express.Application, daprUrl: string);
    publish(pubSubName: string, topic: string, body?: object): Promise<number>;
    subscribe(pubSubName: string, topic: string, cb: TypeDaprPubSub): void;
}
