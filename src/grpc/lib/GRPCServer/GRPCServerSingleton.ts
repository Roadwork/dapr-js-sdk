import GRPCServer, { IServerImplType, IServerType } from "./GRPCServer";

export default class GRPCServerSingleton {
  private static instance?: GRPCServer;

  /**
   * Private constructor to prevent direct construction calls
   */
  private constructor() {}

  public static async initialize(host: string, port: string): Promise<void> {
    const instance = new GRPCServer(host, port);
    await instance.initialize();
    this.instance = instance;

    console.log("[Dapr-JS][gRPC] Created GRPC Server Singleton");
  }

  /**
   * The static method that controls the access to the singleton instance.
   *
   * This implementation let you subclass the Singleton class while keeping
   * just one instance of each subclass around.
   */
  public static async getInstance(): Promise<GRPCServer> {
    if (!this.instance) {
      throw new Error(JSON.stringify({
        error: "GRPC_SERVER_NOT_INITIALIZED",
        error_message: "The gRPC server was not initialized, did you call `await GRPCServerSingleton.initialize()`?"
      }))
    }

    return this.instance;
  }

  public static async getServer(): Promise<IServerType> {
    const server = await this.getInstance();
    return server.server;
  }

  public static async getServerImpl(): Promise<IServerImplType> {
    const server = await this.getInstance();
    return server.serverImpl;
  }

  public static async getServerAddress(): Promise<string> {
    const server = await this.getInstance();
    return server.getServerAddress();
  }

  public static async destroy(): Promise<void> {
    if (!this.instance) {
      return;
    }

    const server = await this.getInstance();
    await server.close();
    console.log("[Dapr-JS] Destroyed GRPCServerSingleton");

    delete this.instance;
  }
}