import GRPCServer from "./GRPCServer";

// https://docs.dapr.io/reference/api/actors_api/
export default class DaprActor {
    server: GRPCServer;
  
    constructor(server: GRPCServer) {
        this.server = server;
    }
}
