import { IKeyValuePair } from "../types/KeyValuePair.type";
import { OperationType } from "../types/Operation.type";
import { IRequestMetadata } from "../types/RequestMetadata.type";

export default interface IClientStateStrategy {
    save(storeName: string, stateObjects: IKeyValuePair[]): Promise<void>;
    get(storeName: string, key: string): Promise<object>;
    getBulk(storeName: string, keys: string[], parallelism: number, metadata: string): Promise<object>;
    delete(storeName: string, key: string): Promise<void>;
    transaction(storeName: string, operations: OperationType[], metadata: IRequestMetadata | null): Promise<void>;
}