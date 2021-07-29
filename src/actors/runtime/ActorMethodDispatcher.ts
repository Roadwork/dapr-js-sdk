import { AbstractActor } from "../..";
import ActorTypeInformation from "./ActorTypeInformation";

/**
 * The ActorMethodDispatcher is used by the actor remoting code generator to generate a type that dispatches a request to an actor object by invoking the right method on it
 */
export default class ActorMethodDispatcher<T extends AbstractActor> {
    constructor(typeInfo: ActorTypeInformation<T>) {
        // Gets a list of dispatchable attributes from the actor
        this.dispatchMapping = getDispatchableAttrs(typeInfo.getImplementationType());
    }

    async dispatch(actor: T, name: string, ...args): any {
        // getattr(x, 'foobar') is the same as x.foobar it gets the value of a NAMED attribute (e.g. foobar: string)
        //         return await getattr(actor, self._dispatch_mapping[name]['method_name'])(*args, **kwargs)

    }
}