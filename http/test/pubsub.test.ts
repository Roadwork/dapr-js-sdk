import fetch from 'node-fetch';
import { IRequest, IResponse } from "../src/lib/WebServer";
import HttpStatusCode from '../src/enum/HttpStatusCode.enum';
import DaprPubSub from '../src/lib/pubsub';
import { setupHooks, getState } from './utils/hook.util';
import WebServerSingleton from '../src/lib/WebServer/WebServerSingleton';

// https://docs.dapr.io/reference/api/pubsub_api/
describe('pubsub', () => {
  setupHooks();

  describe('pubsub/subscribe', () => {
    it('should be able to subscribe to a topic and receive messages', async () => {
      const state = await getState();

      const client = new DaprPubSub(state.serverAddress);
      console.log(state.serverAddress)

      const mock = jest.fn(async (req: object, res: object) => {})
      client.subscribe("pubsub-name", "topic-name", mock);

      // const appUrl = await WebServerSingleton.getServerAddress();

      const res = await fetch(`${state.serverAddress}/route-pubsub-name-topic-name`, {
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

  describe('pubsub/publish', () => {
    it('should be able to publish messages', async () => {
      const state = await getState();

      const mock = jest.fn(async (req: IRequest, res: IResponse) => res.send({ isSuccess: true }))
      state.server.post(`/publish/my-pubsub/my-topic`, mock); // dapr will translate this to /my-method, they however test this already

      const client = new DaprPubSub(state.serverAddress);
      const res = await client.publish("my-pubsub", "my-topic", { hello: "world" });

      expect(res).toEqual(200);
    })
  });
});