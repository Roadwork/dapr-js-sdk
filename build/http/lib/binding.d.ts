declare type FunctionDaprInputCallback = (data: any) => Promise<any>;
export default class DaprBinding {
    daprUrl: string;
    constructor(daprUrl: string);
    receive(bindingName: string, cb: FunctionDaprInputCallback): Promise<void>;
    send(bindingName: string, data: any, metadata: object): Promise<object>;
}
export {};
