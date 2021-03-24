import fetch from 'node-fetch';
import ResponseUtil from '../utils/Response.util';
import { InvokeFetchOptions } from '../types/InvokeFetchOptions';
import { OperationType } from '../types/Operation.type';
import { ActorReminderType } from '../types/ActorReminder.type';
import { ActorTimerType } from '../types/ActorTimer.type';
import { ResActorDeactivateDto } from '../dto/ResActorDeactivate.dto';

// https://docs.dapr.io/reference/api/actors_api/
export default class DaprActor {
  daprUrl: string;

  constructor(daprUrl: string) {
    this.daprUrl = daprUrl;
  }

  async invoke(method: "GET" | "POST" | "PUT" | "DELETE" = "POST", actorType: string, actorId: string, methodName: string, body?: object): Promise<object> {
    const fetchOptions: InvokeFetchOptions = {
      method,
      headers: {
        "Content-Type": "application/json"
      }
    }

    if (body) {
      fetchOptions.body = JSON.stringify(body);
    }

    const res = await fetch(`${this.daprUrl}/actors/${actorType}/${actorId}/method/${methodName}`, fetchOptions as object);
    
    return ResponseUtil.handleResponse(res);
  }

  async stateTransaction(actorType: string, actorId: string, operations: OperationType[]): Promise<object> {
    const res = await fetch(`${this.daprUrl}/actors/${actorType}/${actorId}/state`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(operations)
    });

    return ResponseUtil.handleResponse(res);
  }

  async stateGet(actorType: string, actorId: string, key: string): Promise<object> {
    const res = await fetch(`${this.daprUrl}/actors/${actorType}/${actorId}/state/${key}`);
    return ResponseUtil.handleResponse(res);
  }

  async reminderCreate(actorType: string, actorId: string, name: string, reminder: ActorReminderType): Promise<object> {
    const res = await fetch(`${this.daprUrl}/actors/${actorType}/${actorId}/reminders/${name}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(reminder),
    });
    return ResponseUtil.handleResponse(res);
  }

  async reminderGet(actorType: string, actorId: string, name: string): Promise<object> {
    const res = await fetch(`${this.daprUrl}/actors/${actorType}/${actorId}/reminders/${name}`);
    return ResponseUtil.handleResponse(res);
  }

  async reminderDelete(actorType: string, actorId: string, name: string): Promise<number> {
    const req = await fetch(`${this.daprUrl}/actors/${actorType}/${actorId}/reminders/${name}`, {
      method: 'DELETE',
    });

    return req.status;
  }

  async timerCreate(actorType: string, actorId: string, name: string, timer: ActorTimerType): Promise<object> {
    const res = await fetch(`${this.daprUrl}/actors/${actorType}/${actorId}/timers/${name}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(timer),
    });
    return ResponseUtil.handleResponse(res);
  }

  async timerDelete(actorType: string, actorId: string, name: string): Promise<number> {
    const req = await fetch(`${this.daprUrl}/actors/${actorType}/${actorId}/timers/${name}`, {
      method: 'DELETE',
    });

    return req.status;
  }

  async deactivate(actorType: string, actorId: string): Promise<ResActorDeactivateDto> {
    const res = await fetch(`${this.daprUrl}/actors/${actorType}/${actorId}`, {
      method: 'DELETE',
    });

    return ResponseUtil.handleResponse(res);
  }

  async getActors(): Promise<object> {
    const res = await fetch(`${this.daprUrl.replace('/v1.0', '')}/dapr/config`);
    return ResponseUtil.handleResponse(res);
  }
}
