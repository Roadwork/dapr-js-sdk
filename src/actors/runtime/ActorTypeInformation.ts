import IActor from "../IActor";
import AbstractActor from "./AbstractActor";

export default class ActorTypeInformation<T extends AbstractActor> {
    name: string;
    implementationType: T;
    actorBases: IActor[];

    constructor(name: string, implementationClass: T, actorBases: IActor[]) {
        this.name = name;
        this.implementationType = implementationClass;
        this.actorBases = actorBases;
    }
}