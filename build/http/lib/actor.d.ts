import { OperationType } from '../types/Operation.type';
import { ActorReminderType } from '../types/ActorReminder.type';
import { ActorTimerType } from '../types/ActorTimer.type';
import { ResActorDeactivateDto } from '../dto/ResActorDeactivate.dto';
export default class DaprActor {
    daprUrl: string;
    constructor(daprUrl: string);
    invoke(method: "POST" | "DELETE" | "GET" | "PUT" | undefined, actorType: string, actorId: string, methodName: string, body?: object): Promise<object>;
    stateTransaction(actorType: string, actorId: string, operations: OperationType[]): Promise<object>;
    stateGet(actorType: string, actorId: string, key: string): Promise<object>;
    reminderCreate(actorType: string, actorId: string, name: string, reminder: ActorReminderType): Promise<object>;
    reminderGet(actorType: string, actorId: string, name: string): Promise<object>;
    reminderDelete(actorType: string, actorId: string, name: string): Promise<number>;
    timerCreate(actorType: string, actorId: string, name: string, timer: ActorTimerType): Promise<object>;
    timerDelete(actorType: string, actorId: string, name: string): Promise<number>;
    deactivate(actorType: string, actorId: string): Promise<ResActorDeactivateDto>;
    getActors(): Promise<object>;
}
