import express from "express";
import HttpStatusCode from '../src/enum/HttpStatusCode.enum';
import DaprSecret from '../src/lib/secret';
import WebServerSingleton from "../src/singleton/WebServerSingleton";
import { setupHooks, getState } from './utils/hook.util';

// https://docs.dapr.io/reference/api/secrets_api/
describe('secret', async () => {
  setupHooks();

  describe('secret/get', () => {
    it('should translate to a state get call', async () => {
      const state = getState();

      const mock = jest.fn(async (req: express.Request, res: express.Response) => res.status(HttpStatusCode.OK).send({ isSuccess: true, body: req.body, query: req.query }))
      state.server.get(`/secrets/my-store/my-key`, mock); // dapr will translate this to /my-method, they however test this already

      const client = new DaprSecret(state.serverUrl);
      const res = await client.get("my-store", "my-key");

      expect(res).toEqual({ isSuccess: true, body: {}, query: {} });
    })
  });

  describe('secret/getBulk', () => {
    it('should translate to a state getBulk call', async () => {
      const state = getState();

      const mock = jest.fn(async (req: express.Request, res: express.Response) => res.status(HttpStatusCode.OK).send({ isSuccess: true, body: req.body, query: req.query }))
      state.server.post(`/secrets/my-store/bulk`, mock); // dapr will translate this to /my-method, they however test this already

      const client = new DaprSecret(state.serverUrl);
      const res = await client.getBulk("my-store", [ "key1", "key2", "key3" ], 10);

      expect(res).toEqual({ isSuccess: true, body: { keys: [ "key1", "key2", "key3" ], parallelism: 10 }, query: {} });
    })
  });
});