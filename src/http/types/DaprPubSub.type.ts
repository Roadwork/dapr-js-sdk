import { IRequest, IResponse } from "../lib/WebServer";

export type TypeDaprPubSub = (req: IRequest, res: IResponse) => Promise<void>;
export type TypeElementOfDaprPubSub = {
    pubSubName:String,
    topic:String,
    cb : TypeDaprPubSub | any,
    route:String
}