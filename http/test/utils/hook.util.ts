import { WebServerSingleton } from '../../src/lib/WebServer';
import WebServer, { IServerType } from '../../src/lib/WebServer/WebServer';

export async function hookBeforeEach() {
  await WebServerSingleton.getInstance();
}

export async function hookAfterEach() {
  await WebServerSingleton.destroy();
}

export function setupHooks() {
  beforeEach(async () => {
    await hookBeforeEach();
  });

  afterEach(async () => {
    await hookAfterEach();
  });
}

export async function getState() {
  return {
    server: await WebServerSingleton.getServer(),
    serverAddress: await WebServerSingleton.getServerAddress()
  }
}