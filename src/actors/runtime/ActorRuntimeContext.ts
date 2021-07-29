import { DaprClient } from "../..";
import AbstractActor from "./AbstractActor";
import ActorFactory from "./ActorFactory";
import ActorTypeInformation from "./ActorTypeInformation";
import StateProvider from "./StateProvider";

export default class ActorManagerContext<T extends AbstractActor> {
    private actorFactory: ActorFactory<T>;
    private actorTypeInformation: ActorTypeInformation<T>;
    private daprClient: DaprClient;
    private provider: StateProvider;

    constructor(actorFactory: ActorFactory<T>, actorTypeInformation: ActorTypeInformation<T>, actorClient: DaprClient) {
        this.actorTypeInformation = actorTypeInformation;
        this.actorFactory = actorFactory;
        
        // Create state management provider for the actor
        this.daprClient = actorClient;
        this.provider = new StateProvider(this.daprClient);
    }

    getActorTypeInformation(): ActorTypeInformation<T> {
        return this.actorTypeInformation;
    }

    getActorFactory(): ActorFactory<T> {
        return this.actorFactory;
    }
}