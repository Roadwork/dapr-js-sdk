import { IRequest, IResponse } from "../lib/WebServer";

export type TypeDaprInvoke = (req: IRequest, res: IResponse) => Promise<void>;