import express from "express";
import HttpStatusCode from '../src/enum/HttpStatusCode.enum';
import DaprInvoke from '../src/lib/invoker';
import { setupHooks, getState } from './utils/hook.util';

describe('invoker', () => {
  setupHooks();

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