import fetch from 'node-fetch';
import express from "express";
import HttpStatusCode from '../src/enum/HttpStatusCode.enum';
import DaprActor from '../src/lib/actor';
import { setupHooks, getState } from './utils/hook.util';

// https://docs.dapr.io/reference/api/actors_api/
describe('actor', () => {
  setupHooks();

  describe('actor/invoke', () => {
    it('should be able to invoke a method', async () => {
      const state = getState();

      const mock = jest.fn(async (req: express.Request, res: express.Response) => res.status(HttpStatusCode.OK).send({ isSuccess: true, body: req.body, query: req.query }))
      state.server.post(`/actors/my-actor-type/my-actor-id/method/my-method`, mock); // dapr will translate this to /my-method, they however test this already

      const client = new DaprActor(state.serverUrl);

      const res = await client.invoke("POST", "my-actor-type", "my-actor-id", "my-method", { hello: "world" });
      expect(res).toEqual({ isSuccess: true, body: { hello: "world" }, query: {} });
    })
  });

  describe('actor/stateTransaction', () => {
    it('should translate to a state transaction call', async () => {
      const state = getState();

      const mock = jest.fn(async (req: express.Request, res: express.Response) => res.status(HttpStatusCode.OK).send({ isSuccess: true, body: req.body, query: req.query }))
      state.server.post(`/actors/my-actor-type/my-actor-id/state`, mock); // dapr will translate this to /my-method, they however test this already

      const client = new DaprActor(state.serverUrl);
      const res = await client.stateTransaction("my-actor-type", "my-actor-id", [
        {
          operation: "upsert",
          request: {
            key: "key1",
            value: "myData"
          }
        },
        {
          operation: "delete",
          request: {
            key: "key2"
          }
        },
      ]);

      expect(res).toEqual({
        isSuccess: true,
        body: [
          {
            operation: "upsert",
            request: {
              key: "key1",
              value: "myData"
            }
          },
          {
            operation: "delete",
            request: {
              key: "key2"
            }
          },
        ],
        query: {}
      });
    })
  });

  describe('actor/get', () => {
    it('should translate to a state get call', async () => {
      const state = getState();

      const mock = jest.fn(async (req: express.Request, res: express.Response) => res.status(HttpStatusCode.OK).send({ isSuccess: true, body: req.body, query: req.query }))
      state.server.get(`/actors/my-actor-type/my-actor-id/state/my-key`, mock); // dapr will translate this to /my-method, they however test this already

      const client = new DaprActor(state.serverUrl);
      const res = await client.stateGet("my-actor-type", "my-actor-id", "my-key");

      expect(res).toEqual({ isSuccess: true, body: {}, query: {} });
    })
  });

  describe('actor/reminder/create', () => {
    it('should translate to a reminder creation call', async () => {
      const state = getState();

      const mock = jest.fn(async (req: express.Request, res: express.Response) => res.status(HttpStatusCode.OK).send({ isSuccess: true, body: req.body, query: req.query }))
      state.server.post(`/actors/my-actor-type/my-actor-id/reminders/my-reminder`, mock); // dapr will translate this to /my-method, they however test this already

      const client = new DaprActor(state.serverUrl);
      const res = await client.reminderCreate("my-actor-type", "my-actor-id", "my-reminder", {
        dueTime: "0h0m3s0ms",
        period: "0h0m7s0ms"
      });

      expect(res).toEqual({ isSuccess: true, body: {
        dueTime: "0h0m3s0ms",
        period: "0h0m7s0ms"
      }, query: {} });
    })
  });

  describe('actor/reminder/get', () => {
    it('should translate to a reminder get call', async () => {
      const state = getState();

      const mock = jest.fn(async (req: express.Request, res: express.Response) => res.status(HttpStatusCode.OK).send({ isSuccess: true, body: req.body, query: req.query }))
      state.server.get(`/actors/my-actor-type/my-actor-id/reminders/my-reminder`, mock); // dapr will translate this to /my-method, they however test this already

      const client = new DaprActor(state.serverUrl);
      const res = await client.reminderGet("my-actor-type", "my-actor-id", "my-reminder");

      expect(res).toEqual({ isSuccess: true, body: {}, query: {} });
    })
  });

  describe('actor/reminder/delete', () => {
    it('should translate to a reminder delete call', async () => {
      const state = getState();

      const mock = jest.fn(async (req: express.Request, res: express.Response) => res.status(HttpStatusCode.OK).send({ isSuccess: true, body: req.body, query: req.query }))
      state.server.delete(`/actors/my-actor-type/my-actor-id/reminders/my-reminder`, mock); // dapr will translate this to /my-method, they however test this already

      const client = new DaprActor(state.serverUrl);
      const res = await client.reminderDelete("my-actor-type", "my-actor-id", "my-reminder");

      expect(res).toEqual(200);
    })
  });

  describe('actor/timer/create', () => {
    it('should translate to a timer creation call', async () => {
      const state = getState();

      const mock = jest.fn(async (req: express.Request, res: express.Response) => res.status(HttpStatusCode.OK).send({ isSuccess: true, body: req.body, query: req.query }))
      state.server.post(`/actors/my-actor-type/my-actor-id/timers/my-timer`, mock); // dapr will translate this to /my-method, they however test this already

      const client = new DaprActor(state.serverUrl);
      const res = await client.timerCreate("my-actor-type", "my-actor-id", "my-timer", {
        data: "test-data",
        dueTime: "0h0m3s0ms",
        period: "0h0m7s0ms",
        callback: "my-callback"
      });

      expect(res).toEqual({ isSuccess: true, body: {
        data: "test-data",
        dueTime: "0h0m3s0ms",
        period: "0h0m7s0ms",
        callback: "my-callback"
      }, query: {} });
    })
  });

  describe('actor/timer/delete', () => {
    it('should translate to a timer delete call', async () => {
      const state = getState();

      const mock = jest.fn(async (req: express.Request, res: express.Response) => res.status(HttpStatusCode.OK).send({ isSuccess: true, body: req.body, query: req.query }))
      state.server.delete(`/actors/my-actor-type/my-actor-id/timers/my-timer`, mock); // dapr will translate this to /my-method, they however test this already

      const client = new DaprActor(state.serverUrl);
      const res = await client.timerDelete("my-actor-type", "my-actor-id", "my-timer");

      expect(res).toEqual(200);
    })
  });
});