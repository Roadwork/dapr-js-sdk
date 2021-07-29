import { AbstractActor } from "../..";
import ActorId from "../ActorId";
import ActorRuntimeContext from "./ActorRuntimeContext";

export default interface ActorFactory<T extends AbstractActor> {
    createActor(actorId: ActorId): T;
}