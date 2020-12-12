import express from "express";
interface IKeyValuePair {
    key: string;
    value: string;
}
export default class DaprState {
    url: string;
    urlDapr: string;
    port: number;
    express: express.Application;
    constructor(express: express.Application, daprUrl: string, daprPort: number);
    save(storeName: string, stateObjects: IKeyValuePair[]): Promise<any>;
    get(storeName: string, key: string): Promise<any>;
    delete(storeName: string, key: string): Promise<number>;
}
export {};
