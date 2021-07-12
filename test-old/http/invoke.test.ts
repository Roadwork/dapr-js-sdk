import fetch from 'node-fetch';
import { IRequest, IResponse } from "../../src/http/lib/WebServer";
import { HttpMethod } from "../../src/http/enum/HttpMethod.enum";
import DaprInvoker from "../../src/http/lib/invoker";
import { setupHooks, getState } from './utils/hook.util';
import WebServerSingleton from '../../src/http/lib/WebServer/WebServerSingleton';

describe('invoker', () => {
  setupHooks();

  describe('invoker/listen', () => {
    it('should be able to listen to a method and receive an invocation on the internal web server - defaults to GET call listen', async () => {
      const state = await getState();

      const client = new DaprInvoker(state.serverAddress);

      const mock = jest.fn(async (req: IRequest, res: IResponse) => res.send({ isSuccess: true }))
      client.listen("my-method-name", mock);

      const appUrl = await WebServerSingleton.getServerAddress();

      const res = await fetch(`${appUrl}/my-method-name`);

      expect(mock.mock.calls.length).toBe(1);
    })

    // ??
    // it('should be able to listen to a method but NOT receive it on the dapr server', async () => {
    //   const state = await getState();

    //   const client = new DaprInvoker(state.serverAddress);

    //   const mock = jest.fn(async (req: IRequest, res: IResponse) => res.send({ isSuccess: true }))
    //   client.listen("my-method-name", mock);

    //   // We call the internal Dapr server as set in state.serverUrl
    //   const res = await fetch(`${state.serverAddress}/my-method-name`);

    //   console.log(mock.mock);
    //   expect(mock.mock.calls.length).toBe(0);
    // })

    it('should be able to listen to a method and receive an invocation - customized to POST call', async () => {
      const state = await getState();

      const client = new DaprInvoker(state.serverAddress);

      const mock = jest.fn(async (req: IRequest, res: IResponse) => res.send({ isSuccess: true }))
      client.listen("my-method-name", mock, { method: HttpMethod.POST });

      const appUrl = await WebServerSingleton.getServerAddress();

      const res = await fetch(`${appUrl}/my-method-name`, {
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
    it('should be able to invoke a method - defaults to GET', async () => {
      const state = await getState();

      const mock = jest.fn(async (req: IRequest, res: IResponse) => res.send({ isSuccess: true, body: req.body }));
      state.server.get(`/invoke/my-app/method/my-method`, mock); // dapr will translate this to /my-method, they however test this already

      const client = new DaprInvoker(state.serverAddress);

      const res = await client.invoke("my-app", "my-method");
      expect(res).toEqual({ isSuccess: true, body: {} });
    });

    it('should be able to invoke a method with POST', async () => {
      const state = await getState();

      const mock = jest.fn(async (req: IRequest, res: IResponse) => res.send({ isSuccess: true, body: req.body }));
      state.server.post(`/invoke/my-app/method/my-method`, mock); // dapr will translate this to /my-method, they however test this already

      const client = new DaprInvoker(state.serverAddress);

      const res = await client.invoke("my-app", "my-method", HttpMethod.POST, { hello: "world" });
      expect(res).toEqual({ isSuccess: true, body: { hello: "world" } });
    });
  });
});