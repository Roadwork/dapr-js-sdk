import express from "express";
import TypeDaprInvoke from "./invoke.type";
export default class DaprInvoke {
    url: string;
    urlDapr: string;
    port: number;
    express: express.Application;
    constructor(express: express.Application, daprUrl: string, daprPort: number);
    receive(endpoint: string, cb: TypeDaprInvoke): Promise<void>;
    invoke(appId: string, methodName: string, data: object): Promise<any>;
}
