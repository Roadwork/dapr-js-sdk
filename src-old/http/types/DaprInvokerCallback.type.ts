import { IRequest, IResponse } from "../lib/WebServer";

export interface DaprInvokerCallbackContentMetadata {
    contentType?: string;
}

export interface DaprInvokerCallbackContent {
    body?: string;
    query?: string;
    metadata?: DaprInvokerCallbackContentMetadata
};



export type TypeDaprInvokerCallback = (data: DaprInvokerCallbackContent) => Promise<any | void>;