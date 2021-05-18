import { IRequest, IResponse } from "../lib/GRPCServer";

export type TypeDaprInvokerCallback = (req: IRequest, res: IResponse) => Promise<any | void>;