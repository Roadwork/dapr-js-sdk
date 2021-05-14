import { IKeyValuePair } from '../types/KeyValuePair.type';
import { OperationType } from '../types/Operation.type';
import { IRequestMetadata } from '../types/RequestMetadata.type';
export default class DaprState {
    daprUrl: string;
    constructor(daprUrl: string);
    save(storeName: string, stateObjects: IKeyValuePair[]): Promise<object>;
    get(storeName: string, key: string): Promise<object>;
    getBulk(storeName: string, keys: string[], parallelism?: number, metadata?: string): Promise<object>;
    delete(storeName: string, key: string): Promise<number>;
    transaction(storeName: string, operations?: OperationType[], metadata?: IRequestMetadata | null): Promise<object>;
}
