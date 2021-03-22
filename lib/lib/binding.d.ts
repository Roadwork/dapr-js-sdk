import express from 'express';
declare type FunctionDaprInputCallback = (data: object) => Promise<any>;
export default class DaprBinding {
    daprUrl: string;
    express: express.Application;
    constructor(express: express.Application, daprUrl: string);
    receive(bindingName: string, cb: FunctionDaprInputCallback): void;
    send(bindingName: string, data: any, metadata: object): Promise<object>;
}
export {};
