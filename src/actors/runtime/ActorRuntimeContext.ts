import { DaprClient } from "../..";
import AbstractActor from "./AbstractActor";
import ActorFactory from "./ActorFactory";
import ActorTypeInformation from "./ActorTypeInformation";
import StateProvider from "./StateProvider";

export default class ActorRuntimeContext<T extends AbstractActor> {
    actorFactory: ActorFactory<T>;
    actorTypeInfo: ActorTypeInformation<T>;
    daprClient: DaprClient;
    provider: StateProvider;

    constructor(actorFactory: ActorFactory<T>, actorTypeInfo: ActorTypeInformation<T>, actorClient: DaprClient) {
        this.actorTypeInfo = actorTypeInfo;
        this.actorFactory = actorFactory;
        
        // Create state management provider for the actor
        this.daprClient = actorClient;
        this.provider = new StateProvider(this.daprClient);
    }
}