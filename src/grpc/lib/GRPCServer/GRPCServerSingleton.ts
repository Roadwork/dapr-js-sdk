import GRPCServer, { IServerImplType, IServerType } from "./GRPCServer";

export default class GRPCServerSingleton {
  private static instance?: GRPCServer;

  /**
   * Private constructor to prevent direct construction calls
   */
  private constructor() {}

  public static async startServer(host: string, port: string): Promise<void> {
    const instance = this.getInstance();
    await instance.startServer(host, port);

    this.instance = instance;

    console.log("[Dapr-JS][gRPC] Created GRPC Server Singleton");
  }

  /**
   * The static method that controls the access to the singleton instance.
   *
   * This implementation let you subclass the Singleton class while keeping
   * just one instance of each subclass around.
   */
  public static getInstance(): GRPCServer {
    if (!this.instance) {
      this.instance = new GRPCServer();
    }

    return this.instance;
  }

  public static getServer(): IServerType {
    const server = this.getInstance();
    return server.server;
  }

  public static getServerImpl(): IServerImplType {
    const server = this.getInstance();
    return server.serverImpl;
  }

  public static getServerAddress(): string {
    const server = this.getInstance();
    return server.getServerAddress();
  }

  public static async destroy(): Promise<void> {
    if (!this.instance) {
      return;
    }

    const server = this.getInstance();
    await server.close();
    console.log("[Dapr-JS] Destroyed GRPCServerSingleton");

    delete this.instance;
  }
}