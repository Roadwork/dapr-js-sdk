import { IRequest, IResponse } from "../lib/WebServer";
export declare type TypeDaprInvokerCallback = (req: IRequest, res: IResponse) => Promise<any | void>;
