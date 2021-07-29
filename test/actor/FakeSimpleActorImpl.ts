import { AbstractActor } from "../../src";
import IFakeSimpleActor from "./FakeSimpleActor.interface";

export default class FakeSimpleActorImpl extends AbstractActor implements IFakeSimpleActor {
    sayMessage(msg: string): string {
        return msg;
    }
}