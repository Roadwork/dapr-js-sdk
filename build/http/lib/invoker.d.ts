import { TypeDaprInvokerCallback } from '../types/DaprInvokerCallback.type';
import { InvokerListenOptionsType } from '../types/InvokerListenOptions.type';
import { InvokerListenOptionsMethod } from '../enum/InvokerListenOptionsMethod.enum';
export default class DaprInvoker {
    daprUrl: string;
    constructor(daprUrl: string);
    listen(methodName: string, cb: TypeDaprInvokerCallback, options?: InvokerListenOptionsType): Promise<void>;
    invoke(appId: string, methodName: string, method?: InvokerListenOptionsMethod, data?: object): Promise<object>;
}
