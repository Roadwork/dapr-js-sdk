import { AbstractActor } from "../..";
import Class from "../../types/Class";

/**
 * Gets the list of dispatchable attributes from the actor
 * 
 * @param actorClass The actor object which extends AbstractActor
 * @returns Map<string, any> containing the ...
 */
export function getDispatchableAttributes<T extends AbstractActor>(actorClass: Class<T>): Map<string, any> {
    const actorInterfaces = getActorInterfaces(actorClass);
}

/**
 * Gets the list of the base classes that extend AbstractActor
 * 
 * @param actorClass The actor object which extends AbstractActor
 * @returns Map<string, any> containing the ...
 */
export function getActorInterfaces<T extends AbstractActor>(actorClass: Class<T>): Class<AbstractActor>[] {

}