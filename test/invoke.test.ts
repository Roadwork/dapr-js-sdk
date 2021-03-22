import fetch from 'node-fetch';
import express from "express";
import HttpStatusCode from '../src/enum/HttpStatusCode.enum';
import { InvokerListenOptionsMethod } from "../src/enum/InvokerListenOptionsMethod.enum";
import DaprInvoker from "../src/lib/invoker";
import DaprInvoke from '../src/lib/invoker';
import { setupHooks, getState } from './utils/hook.util';

describe('invoker', () => {
  setupHooks();

  describe('invoker/listen', () => {
    it('should be able to listen to a method and receive an invocation - defaults to GET call listen', async () => {
      const state = getState();

      const client = new DaprInvoker(state.server, state.serverUrl);

      const mock = jest.fn(async (req: express.Request, res: express.Response) => res.status(HttpStatusCode.OK).send({ isSuccess: true }))
      client.listen("my-method-name", mock);

      const res = await fetch(`${state.serverUrl}/my-method-name`);

      expect(mock.mock.calls.length).toBe(1);
    })

    it('should be able to listen to a method and receive an invocation - customized to POST call', async () => {
      const state = getState();

      const client = new DaprInvoker(state.server, state.serverUrl);

      const mock = jest.fn(async (req: express.Request, res: express.Response) => res.status(HttpStatusCode.OK).send({ isSuccess: true }))
      client.listen("my-method-name", mock, { method: InvokerListenOptionsMethod.POST });

      const res = await fetch(`${state.serverUrl}/my-method-name`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          hello: "world"
        })
      });

      expect(mock.mock.calls.length).toBe(1);
    })
  });

  describe('invoker/invoke', () => {
    it('should be able to receive events', async () => {
      const state = getState();

      const mock = jest.fn(async (req: express.Request, res: express.Response) => res.status(HttpStatusCode.OK).send({ isSuccess: true }))
      state.server.post(`/invoke/my-app/method/my-method`, mock); // dapr will translate this to /my-method, they however test this already

      const client = new DaprInvoke(state.server, state.serverUrl);

      const res = await client.invoke("my-app", "my-method", { hello: "world" });
      expect(res).toEqual({ isSuccess: true });
    })
  });
});