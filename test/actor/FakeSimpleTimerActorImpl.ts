import { AbstractActor } from "../../src";
import ActorId from "../../src/actors/ActorId";
import ActorRuntimeContext from "../../src/actors/runtime/ActorRuntimeContext";
import IFakeSimpleTimerActor from "./FakeSimpleTimerActor.interface";

export default class FakeSimpleActorImpl<T extends AbstractActor> extends AbstractActor implements IFakeSimpleTimerActor {
    timerCalled: boolean;

    constructor(ctx: ActorRuntimeContext<T>, actorId: ActorId) {
        super(ctx, actorId);
        this.timerCalled = false;
    }

    async timerCallback(arg: number): Promise<void> {
        this.timerCalled = true;
    }

    async receiveReminder(arg: number): Promise<void> {
    }

    async actorMethod(arg: number): Promise<object> {
        return { "name": "actor_method" }
    }
}