import { IActor } from "../../src";

export default interface IFakeSimpleTimerActor extends IActor {
    actorMethod(arg: number): Promise<object>;
    timerCallback(arg: number): Promise<void>;
    receiveReminder(arg: number): Promise<void>;
}