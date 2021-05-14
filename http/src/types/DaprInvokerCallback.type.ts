import { IRequest, IResponse } from "../lib/WebServer";

export type TypeDaprInvokerCallback = (req: IRequest, res: IResponse) => Promise<any | void>;