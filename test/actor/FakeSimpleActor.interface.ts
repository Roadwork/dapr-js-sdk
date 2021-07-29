import { IActor } from "../../src";

export default interface IFakeSimpleActor extends IActor {
    sayMessage(msg: string): string;
}