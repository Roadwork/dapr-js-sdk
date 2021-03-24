import fetch from 'node-fetch';
import express from "express";
import HttpStatusCode from '../src/enum/HttpStatusCode.enum';
import DaprPubSub from '../src/lib/pubsub';
import { setupHooks, getState } from './utils/hook.util';
import WebServerSingleton from '../src/singleton/WebServerSingleton';

// https://docs.dapr.io/reference/api/pubsub_api/
console.log("ERROR")
setupHooks();


describe('pubsub', () => {
  describe('pubsub/subscribe', () => {
    it('should be able to subscribe to a topic and receive messages', async () => {
      const state = getState();

      const client = new DaprPubSub(state.serverUrl);

      const mock = jest.fn(async (req: object, res: object) => {})
      client.subscribe("pubsub-name", "topic-name", mock);

      const appUrl = await WebServerSingleton.getInstance().getServerListenerUrl();
      const res = await fetch(`${appUrl}/route-pubsub-name-topic-name`, {
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
      const state = getState();

      const mock = jest.fn(async (req: express.Request, res: express.Response) => res.status(HttpStatusCode.OK).send({ isSuccess: true }))
      state.server.post(`/publish/my-pubsub/my-topic`, mock); // dapr will translate this to /my-method, they however test this already

      const client = new DaprPubSub(state.serverUrl);
      const res = await client.publish("my-pubsub", "my-topic", { hello: "world" });

      expect(res).toEqual(200);
    })
  });
});