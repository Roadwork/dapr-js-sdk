import express from 'express';
export default class DaprSecret {
    daprUrl: string;
    express: express.Application;
    constructor(express: express.Application, daprUrl: string);
    get(secretStoreName: string, key: string, metadata?: string): Promise<object>;
    getBulk(secretStoreName: string, keys: Array<string>, parallelism?: number, metadata?: string): Promise<object>;
}
