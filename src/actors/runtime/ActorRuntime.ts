import { AbstractActor, DaprClient } from "../..";
import Class from "../../types/Class";
import ActorId from "../ActorId";
import ActorManager from "./ActorManager";
import ActorRuntimeConfig from "./ActorRuntimeConfig";

/**
 * Creates instances of "Actor" and activates and deactivates "Actor"
 */
export default class ActorRuntime {
    private static instance: ActorRuntime;

    private readonly daprClient: DaprClient;
    private actorManagers: Map<string, ActorManager<any>>;
    private actorRuntimeConfig: ActorRuntimeConfig = new ActorRuntimeConfig();

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
        this.actorManagers = new Map<string, ActorManager<any>>();
    }

    static getInstance(daprClient: DaprClient): ActorRuntime {
        if (!ActorRuntime.instance) {
            ActorRuntime.instance = new ActorRuntime(daprClient);
        }

        return ActorRuntime.instance;
    }

    registerActor<T extends AbstractActor>(actorCls: Class<T>): void {
        // Create an ActorManager if it hasn't been registered yet
        if (!this.actorManagers.has(actorCls.name)) {
            this.actorManagers.set(actorCls.name, new ActorManager<T>(actorCls, this.daprClient));
        }
    }

    getRegisteredActorTypes(): string[] {
        return Array.from(this.actorManagers.keys());
    }

    getActorRuntimeConfig(): ActorRuntimeConfig {
        return this.actorRuntimeConfig;
    }

    setActorRuntimeConfig(config: ActorRuntimeConfig): void {
        this.actorRuntimeConfig = config;
    }

    clearActorManagers(): void {
        this.actorManagers = new Map<string, ActorManager<any>>();
    }

    getActorManager<T extends AbstractActor>(actorTypeName: string): ActorManager<T> {
        const actorManager = this.actorManagers.get(actorTypeName);

        if (!actorManager) {
            throw new Error(`ACTOR_TYPE_${actorTypeName}_NOT_REGISTERED`);
        }

        return actorManager;
    }

    /**
     * Invokes a method on the actor from the runtime
     * This method will open the manager for the actor type and get the matching object
     * It will then invoke the method on this object
     * 
     * @param actorTypeName 
     * @param actorId 
     * @param actorMethodName 
     * @param payload 
     * @returns 
     */
    async invoke(actorTypeName: string, actorId: string, actorMethodName: string, requestBody?: Buffer): Promise<Buffer> {
        const actorIdObj = new ActorId(actorId);
        const manager = this.getActorManager(actorTypeName);
        return await manager.invoke(actorIdObj, actorMethodName, requestBody);
    }

    /**
     * Fires a reminder for the actor
     * 
     * @param actorTypeName the name fo the actor type
     * @param actorId the actor id
     * @param name the name of the reminder
     * @param requestBody the body passed to the reminder callback
     */
    async fireReminder(actorTypeName: string, actorId: string, name: string, requestBody?: Buffer) {
        const actorIdObj = new ActorId(actorId);
        const manager = this.getActorManager(actorTypeName);
        return await manager.fireReminder(actorIdObj, name, requestBody);
    }

    /**
     * Fires a timer for the actor
     * 
     * @param actorTypeName the name fo the actor type
     * @param actorId the actor id
     * @param name the name of the timer
     * @param requestBody the body passed to the timer callback
     */
    async fireTimer(actorTypeName: string, actorId: string, name: string, requestBody?: Buffer) {
        const actorIdObj = new ActorId(actorId);
        const manager = this.getActorManager(actorTypeName);
        return await manager.fireTimer(actorIdObj, name, requestBody);
    }
}