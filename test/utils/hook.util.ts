import express from 'express';
import http from 'http';

interface HookState {
  server: express.Application;
  serverPort: number;
  serverUrl: string;
  serverListener?: http.Server;
}

let state: HookState = {
  server: express(), // we will reset later
  serverPort: 8709,
  serverUrl: `http://127.0.0.1:8709`
}

function createExpress(): express.Application {
  const app = express();
  app.use(express.json());
  return app;
}

export function hookBeforeEach() {
  return new Promise<void>((resolve, reject) => {
    state.server = createExpress();
    state.server.use(express.json());

    state.serverListener = state.server.listen(state.serverPort, resolve);
  });
}

export function hookAfterEach() {
  return new Promise<void>((resolve, reject) => {
    if (!state.serverListener) {
      throw new Error('Server was not initialized!');
    }

    state.serverListener.close((err) => {
      if (err) {
        return reject(err);
      }

      return resolve();
    })
  })
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