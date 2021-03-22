import express from 'express';
import DaprBinding from './lib/binding';
import DaprPubSub from './lib/pubsub';
import DaprState from './lib/state';
import DaprInvoker from './lib/invoker';
import DaprSecret from './lib/secret';
import DaprActor from './lib/actor';
export default class Dapr {
    url: string;
    urlDapr: string;
    daprPort: number;
    daprAppPort: number;
    pubsub: DaprPubSub;
    state: DaprState;
    binding: DaprBinding;
    invoker: DaprInvoker;
    secret: DaprSecret;
    actor: DaprActor;
    express: express.Application;
    constructor(daprUrl: string, daprPort: number, daprAppPort?: number);
    initialize(): Promise<void>;
}
