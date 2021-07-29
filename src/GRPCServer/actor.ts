import GRPCServer from './GRPCServer';
import AbstractActor from '../actors/runtime/AbstractActor';
import Class from '../types/Class';

// https://docs.dapr.io/reference/api/service_invocation_api/
export default class GRPCServerActor {
  server: GRPCServer;

  constructor(server: GRPCServer) {
      this.server = server;
  }
}
