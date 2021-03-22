import express from 'express';
import { TypeDaprInvokerCallback } from '../types/DaprInvokerCallback.type';
import { InvokerListenOptionsType } from '../types/InvokerListenOptions.type';
export default class DaprInvoker {
    daprUrl: string;
    express: express.Application;
    constructor(express: express.Application, daprUrl: string);
    listen(methodName: string, cb: TypeDaprInvokerCallback, options?: InvokerListenOptionsType): Promise<void>;
    invoke(appId: string, methodName: string, data?: object): Promise<object>;
}
