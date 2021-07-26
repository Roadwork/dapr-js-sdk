import ActorId from "../ActorId"
import AbstractActor from "./AbstractActor"
import ActorRuntimeContext from "./ActorRuntimeContext"

export default interface ActorFactory<T extends AbstractActor> {
    /**
     * Create an actor object
     * 
     * @param actorId An ActorId object representing the actor id
     * @returns Actor the new Actor
     */
    createActor(actorRuntimeContext: ActorRuntimeContext<T>, actorId: ActorId): T;
}