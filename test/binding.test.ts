import fetch from 'node-fetch';
import express from "express";
import HttpStatusCode from '../src/enum/HttpStatusCode.enum';
import DaprBinding from '../src/lib/binding';
import { setupHooks, getState } from './utils/hook.util';

describe('binding', () => {
  setupHooks();

  describe('binding/receive', () => {
    it('should be able to receive events', async () => {
      const state = getState();

      const clientBinding = new DaprBinding(state.server, "http://my-dapr-url/v1.0");

      const mockReceive = jest.fn(async (data: object) => {})
      clientBinding.receive("binding-name", mockReceive);

      const res = await fetch(`${state.serverUrl}/binding-name`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          hello: "world"
        })
      });

      expect(mockReceive.mock.calls.length).toBe(1);
    })

    it('should be able to receive events with correct data', async () => {
      const state = getState();

      const clientBinding = new DaprBinding(state.server, "http://my-dapr-url/v1.0");

      const mockReceive = jest.fn(async (data: object) => {})
      clientBinding.receive("binding-name", mockReceive);

      const res = await fetch(`${state.serverUrl}/binding-name`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          hello: "world"
        })
      });

      // Expect first argument of first call to equal
      expect(mockReceive.mock.calls[0][0]).toEqual({ hello: "world" });
    })

    it('should receive the HttpState OK when successful processing', async () => {
      const state = getState();

      const clientBinding = new DaprBinding(state.server, "http://my-dapr-url/v1.0");

      const mockReceive = jest.fn(async (data: object) => {})
      clientBinding.receive("binding-name", mockReceive);

      const res = await fetch(`${state.serverUrl}/binding-name`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          hello: "world"
        })
      });

      expect(res.status).toEqual(HttpStatusCode.OK);
    })

    it('should receive the HttpState INTERNAL_SERVER_ERROR when something happened in the callback', async () => {
      const state = getState();

      const clientBinding = new DaprBinding(state.server, "http://my-dapr-url/v1.0");

      const mockReceive = jest.fn(async (data: object) => { throw new Error('SOME_RANDOM_ERROR') })
      clientBinding.receive("binding-name", mockReceive);

      const res = await fetch(`${state.serverUrl}/binding-name`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          hello: "world"
        })
      });

      expect(res.status).toEqual(HttpStatusCode.INTERNAL_SERVER_ERROR);

      const json = await res.json();

      expect(json).toEqual({
        error: 'COULD_NOT_PROCESS_CALLBACK',
        error_msg: 'Something happened while processing the input binding callback - SOME_RANDOM_ERROR'
      });
    })
  })

  describe('binding/send', () => {
    it('should be able to send data', async () => {
      const state = getState();

      const clientBinding = new DaprBinding(state.server, state.serverUrl);

      const mockSend = jest.fn(async (req: express.Request, res: express.Response) => res.status(HttpStatusCode.OK).send({ isSuccess: true }))
      state.server.post(`/bindings/my-binding-name`, mockSend);

      const res = await clientBinding.send("my-binding-name", { hello: "world" }, { my: "key" });
      expect(res).toEqual({ isSuccess: true });
    })
  })
})