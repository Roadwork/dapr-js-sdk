import { AbstractActor } from "../..";
import ActorId from "../ActorId";
import ActorRuntimeContext from "./ActorRuntimeContext";
import IActorFactory from "./IActorFactory";

export default class DefaultFactory<T extends AbstractActor> implements IActorFactory<T> {
    createActor(actorRuntimeContext: ActorRuntimeContext<T>, actorId: ActorId): T {
        if (!actorRuntimeContext) {
            throw new Error("ACTOR_RUNTIME_CONTEXT_NOT_SET");
        }

        const Cls = actorRuntimeContext.getActorTypeInformation().getImplementationClass();
        return new Cls(actorRuntimeContext, actorId);
    }
}