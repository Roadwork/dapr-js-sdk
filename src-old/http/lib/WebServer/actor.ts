import WebServer from './WebServer';

// https://docs.dapr.io/reference/api/actors_api/
export default class DaprServerActor {
  server: WebServer;

  constructor(server: WebServer) {
      this.server = server;
  }
}
