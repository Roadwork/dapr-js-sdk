import express from "express";
import DaprBinding from "./lib/binding";
import DaprPubSub from "./lib/pubsub";
import DaprState from "./lib/state";
import DaprInvoke from "./lib/invoke";
export default class Dapr {
    url: string;
    urlDapr: string;
    port: number;
    pubsub: DaprPubSub;
    state: DaprState;
    binding: DaprBinding;
    invoke: DaprInvoke;
    express: express.Application;
    constructor(daprUrl: string, daprPort: number);
}
