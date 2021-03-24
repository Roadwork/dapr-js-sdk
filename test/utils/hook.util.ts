import express from 'express';
import http from 'http';
import WebServerSingleton from '../../src/singleton/WebServerSingleton';

interface HookState {
  server: express.Application;
  serverPort: number;
  serverUrl: string;
  serverListener?: http.Server;
}

let state: HookState = {
  server: createExpress(), // we will reset later
  serverPort: 8709,
  serverUrl: `http://127.0.0.1:8709`
}

function createExpress(): express.Application {
  const app = express();
  app.use(express.json());
  return app;
}

export async function hookBeforeEach() {
  await (new Promise<void>(async (resolve, reject) => {
    state.server = createExpress();
    state.serverListener = state.server.listen(state.serverPort, resolve);
  }))

  // await (await WebServerSingleton.getInstance()).initialize();
}

export async function hookAfterEach() {
  await (new Promise<void>(async (resolve, reject) => {
    if (!state.serverListener) {
      throw new Error('Server was not initialized!');
    }

    state.serverListener.close((err) => {
      if (err) {
        return reject(err);
      }

      return resolve();
    })
  }))

  await (await WebServerSingleton.getInstance()).close();
}

export function setupHooks() {
  beforeEach(async () => {
    await hookBeforeEach();
  });

  afterEach(async () => {
    await hookAfterEach();
  });
}

export function getState() {
  return state;
}