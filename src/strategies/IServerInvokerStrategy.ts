import { HttpMethod } from "../enum/HttpMethod.enum";
import { TypeDaprInvokerCallback } from "../types/DaprInvokerCallback.type";
import { InvokerListenOptionsType } from "../types/InvokerListenOptions.type";
import { TypeResponseInvokerInvoke } from "../types/response/TypeResponseInvokerInvoke";

export default interface IServerInvokerStrategy {
    listen(methodName: string, cb: TypeDaprInvokerCallback, options: InvokerListenOptionsType): Promise<any>;
}