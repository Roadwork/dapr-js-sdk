import express from 'express';
interface FunctionDaprInputCallback {
    (data: object): Promise<any>;
}
export default class DaprBinding {
    url: string;
    urlDapr: string;
    port: number;
    express: express.Application;
    constructor(express: express.Application, daprUrl: string, daprPort: number);
    receive(bindingName: string, cb: FunctionDaprInputCallback): void;
    send(bindingName: string, data: object): Promise<null | undefined>;
}
export {};
