import { IRequest, IResponse } from "../src/lib/WebServer";
import DaprSecret from '../src/lib/secret';
import { setupHooks, getState } from './utils/hook.util';

// https://docs.dapr.io/reference/api/secrets_api/
describe('secret', () => {
  setupHooks();

  describe('secret/get', () => {
    it('should translate to a state get call', async () => {
      const state = await getState();

      const mock = jest.fn(async (req: IRequest, res: IResponse) => res.send({ isSuccess: true, body: req.body, query: req.query }))
      state.server.get(`/secrets/my-store/my-key`, mock); // dapr will translate this to /my-method, they however test this already

      const client = new DaprSecret(state.serverAddress);
      const res = await client.get("my-store", "my-key");

      expect(res).toEqual({ isSuccess: true, body: {}, query: {} });
    })
  });

  describe('secret/getBulk', () => {
    it('should translate to a state getBulk call', async () => {
      const state = await getState();

      const mock = jest.fn(async (req: IRequest, res: IResponse) => res.send({ isSuccess: true, body: req.body, query: req.query }))
      state.server.post(`/secrets/my-store/bulk`, mock); // dapr will translate this to /my-method, they however test this already

      const client = new DaprSecret(state.serverAddress);
      const res = await client.getBulk("my-store", [ "key1", "key2", "key3" ], 10);

      expect(res).toEqual({ isSuccess: true, body: { keys: [ "key1", "key2", "key3" ], parallelism: 10 }, query: {} });
    })
  });
});