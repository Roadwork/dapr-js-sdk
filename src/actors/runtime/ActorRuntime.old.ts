import { AbstractActor, DaprClient } from "../..";
import Class from "../../types/Class";
import ActorId from "../ActorId";
import ActorFactory from "./ActorFactory";
import ActorManager from "./ActorManager";
import ActorRuntimeConfig from "./ActorRuntimeConfig";
import ActorRuntimeContext from "./ActorRuntimeContext";
import ActorTypeInformation from "./ActorTypeInformation";
import DefaultActorFactory from "./DefaultActorFactory";

/**
 * Creates instances of "Actor" and activates and deactivates "Actor"
 */
export default class ActorRuntime {
    private static instance: ActorRuntime;

    private actorConfig: ActorRuntimeConfig;
    private actorManagers: Map<string, ActorManager<any>>;
    private daprClient: DaprClient;

    // @todo: we need to make sure race condition cannot happen when accessing the active actors
    // NodeJS has an event loop (main thread -> runs JS code) and a worker pool (threadpool -> automatically created for offloading work through libuv) threads
    // we can have a new thread through the worker_thread module 
    // https://medium.com/@mohllal/node-js-multithreading-a5cd74958a67
    // 
    //
    // Python: asyncio.lock -> implements a mutex lock for asyncio tasks to guarantee exclusive access to a shared resource
    // Java: Collections.synchronizedMap -> is a thread-saf synchronized map to guarantee serial access
    // NodeJS: https://nodejs.org/api/worker_threads.html
    // actorManagersLock

    private constructor(daprClient: DaprClient) {
        this.daprClient = daprClient;
        this.actorConfig = new ActorRuntimeConfig();
        this.actorManagers = new Map<string, ActorManager<any>>();
    }

    static getInstance(daprClient: DaprClient): ActorRuntime {
        if (!ActorRuntime.instance) {
            ActorRuntime.instance = new ActorRuntime(daprClient);
        }

        return ActorRuntime.instance;
    }

    setActorConfig(actorConfig: ActorRuntimeConfig) {
        this.actorConfig = actorConfig;
    }

    registerActor<T extends AbstractActor>(actorCls: Class<T>, actorFactory?: ActorFactory<T>): void {
        actorFactory = actorFactory || new DefaultActorFactory<T>();

        const actorTypeInfo = ActorTypeInformation.create<T>(actorCls);

        // Create an ActorManager if it hasn't been registered yet
        if (!this.actorManagers.has(actorTypeInfo.getName())) {
            const context = new ActorRuntimeContext<T>(actorFactory, actorTypeInfo, this.daprClient);
            this.actorManagers.set(actorTypeInfo.getName(), new ActorManager<T>(context));
        }

        // Then add our actor type to the registered actors
        this.actorConfig.addRegisteredActorType(actorTypeInfo.getName());
    }

    getRegisteredActorTypes(): string[] {
        return Array.from(this.actorManagers.keys());
    }

    getActorManager<T extends AbstractActor>(actorTypeName: string): ActorManager<T> {
        const actorManager = this.actorManagers.get(actorTypeName);

        if (!actorManager) {
            throw new Error(`ACTOR_TYPE_${actorTypeName}_NOT_REGISTERED`);
        }

        return actorManager;
    }

    async invoke(actorTypeName: string, actorId: string, actorMethodName: string, payload: Buffer): Promise<Buffer> {
        const actorIdObj = new ActorId(actorId);
        const manager = this.getActorManager(actorTypeName);

        return await manager.invoke(actorIdObj, actorMethodName, payload);
    }
}