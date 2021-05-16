import { IRequest, IResponse } from "../lib/WebServer";

export type TypeDaprPubSub = (req: IRequest, res: IResponse) => Promise<void>;