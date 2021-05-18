import { IRequest, IResponse } from "../lib/GRPCServer";

export type TypeDaprPubSub = (req: IRequest, res: IResponse) => Promise<void>;