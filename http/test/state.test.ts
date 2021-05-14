import HttpStatusCode from '../src/enum/HttpStatusCode.enum';
import DaprState from '../src/lib/state';
import { setupHooks, getState } from './utils/hook.util';
import { IRequest, IResponse } from "../src/lib/WebServer";

// https://docs.dapr.io/reference/api/pubsub_api/
describe('state', () => {
  setupHooks();

  describe('state/save', () => {
    it('should translate to a save call', async () => {
      const state = await getState();

      const mock = jest.fn(async (req: IRequest, res: IResponse) => res.send({ isSuccess: true }))
      state.server.post(`/state/my-store`, mock); // dapr will translate this to /my-method, they however test this already

      const client = new DaprState(state.serverAddress);
      const res = await client.save("my-store", [{ key: "my-key", value: "my-value" }]);

      expect(res).toEqual({ isSuccess: true });
    })
  });

  describe('state/get', () => {
    it('should translate to a state get call', async () => {
      const state = await getState();

      const mock = jest.fn(async (req: IRequest, res: IResponse) => res.send({ isSuccess: true }))
      state.server.get(`/state/my-store/my-key`, mock); // dapr will translate this to /my-method, they however test this already

      const client = new DaprState(state.serverAddress);
      const res = await client.get("my-store", "my-key");

      expect(res).toEqual({ isSuccess: true });
    })
  });

  describe('state/getBulk', () => {
    it('should translate to a state getBulk call', async () => {
      const state = await getState();

      const mock = jest.fn(async (req: IRequest, res: IResponse) => res.send({ isSuccess: true, body: req.body, query: req.query }))
      state.server.post(`/state/my-store/bulk`, mock); // dapr will translate this to /my-method, they however test this already

      const client = new DaprState(state.serverAddress);
      const res = await client.getBulk("my-store", [ "key1", "key2", "key3" ], 10);

      expect(res).toEqual({ isSuccess: true, body: { keys: [ "key1", "key2", "key3" ], parallelism: 10 }, query: {} });
    })
  });

  describe('state/delete', () => {
    it('should translate to a state delete call', async () => {
      const state = await getState();

      const mock = jest.fn(async (req: IRequest, res: IResponse) => res.send({ isSuccess: true }))
      state.server.delete(`/state/my-store/my-key`, mock); // dapr will translate this to /my-method, they however test this already

      const client = new DaprState(state.serverAddress);
      const res = await client.delete("my-store", "my-key");

      expect(res).toEqual(200);
    })
  });

  describe('state/transaction', () => {
    it('should translate to a state transaction call', async () => {
      const state = await getState();

      const mock = jest.fn(async (req: IRequest, res: IResponse) => res.send({ isSuccess: true, body: req.body, query: req.query }))
      state.server.post(`/state/my-store/transaction`, mock); // dapr will translate this to /my-method, they however test this already

      const client = new DaprState(state.serverAddress);
      const res = await client.transaction("my-store", [
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
      ], {
        partitionKey: "planet"
      });

      expect(res).toEqual({
        isSuccess: true,
        body: {
          operations: [
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
          metadata: {
            partitionKey: "planet"
          }
        },
        query: {}
      });
    })
  });
});