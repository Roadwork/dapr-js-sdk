export default class DaprSecret {
    daprUrl: string;
    constructor(daprUrl: string);
    get(secretStoreName: string, key: string, metadata?: string): Promise<object>;
    getBulk(secretStoreName: string, keys: string[], parallelism?: number, metadata?: string): Promise<object>;
}
