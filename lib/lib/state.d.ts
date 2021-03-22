import express from 'express';
import { IKeyValuePair } from '../types/KeyValuePair.type';
import { OperationType } from '../types/Operation.type';
import { IRequestMetadata } from '../types/RequestMetadata.type';
export default class DaprState {
    daprUrl: string;
    express: express.Application;
    constructor(express: express.Application, daprUrl: string);
    save(storeName: string, stateObjects: IKeyValuePair[]): Promise<object>;
    get(storeName: string, key: string): Promise<object>;
    getBulk(storeName: string, keys: Array<string>, parallelism?: number, metadata?: string): Promise<object>;
    delete(storeName: string, key: string): Promise<number>;
    transaction(storeName: string, operations?: Array<OperationType>, metadata?: IRequestMetadata | null): Promise<object>;
}
