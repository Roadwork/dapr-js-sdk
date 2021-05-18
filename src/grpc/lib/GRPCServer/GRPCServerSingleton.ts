import { DaprClient } from "../../proto/dapr/proto/runtime/v1/dapr_grpc_pb";
import GRPCServer, { IServerType } from "./GRPCServer";

export default class GRPCServerSingleton {
  private static instance?: GRPCServer;

  /**
   * Private constructor to prevent direct construction calls
   */
  private constructor() {}

  /**
   * The static method that controls the access to the singleton instance.
   *
   * This implementation let you subclass the Singleton class while keeping
   * just one instance of each subclass around.
   */
  public static async getInstance(): Promise<GRPCServer> {
    if (!this.instance) {
      this.instance = new GRPCServer();
      console.log("[Dapr-JS] Created WebServerSingleton");
    }

    if (!this.instance.isInitialized) {
      await this.instance.initialize();
    }

    return this.instance;
  }

  public static async getServer(): Promise<IServerType> {
    const server = await this.getInstance();
    return server.server;
  }

  public static async getClient(): Promise<DaprClient> {
    const server = await this.getInstance();
    return server.client;
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