import { DaprClient } from "../../proto/dapr/proto/runtime/v1/dapr_grpc_pb";
import GRPCClient from "./GRPCClient";

export default class GRPCClientSingleton {
  private static instance?: GRPCClient;

  /**
   * Private constructor to prevent direct construction calls
   */
  private constructor() {}

  public static async initialize(host: string, port: string): Promise<void> {
    const instance = new GRPCClient(host, port);
    this.instance = instance;

    console.log("[Dapr-JS] Created GRPC Client Singleton");
  }

  /**
   * The static method that controls the access to the singleton instance.
   *
   * This implementation let you subclass the Singleton class while keeping
   * just one instance of each subclass around.
   */
  public static async getInstance(): Promise<GRPCClient> {
    if (!this.instance) {
        throw new Error(JSON.stringify({
            error: "GRPC_CLIENT_NOT_INITIALIZED",
            error_message: "The gRPC client was not initialized, did you call `await GRPCClientSingleton.initialize()`?"
        }))
    }

    return this.instance;
  }

  public static async getClient(): Promise<DaprClient> {
    const singleton = await this.getInstance();
    return singleton.client;
  }

  public static async destroy(): Promise<void> {
    if (!this.instance) {
      return;
    }

    delete this.instance;
  }
}