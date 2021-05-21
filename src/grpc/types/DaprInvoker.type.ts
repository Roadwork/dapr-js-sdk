import { IRequest, IResponse } from "../lib/GRPCServer";

export type TypeDaprInvoke = (req: IRequest, res: IResponse) => Promise<void>;