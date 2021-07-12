import WebServer, { IServerImplType, IServerType } from "./WebServer";

export default class WebServerSingleton {
  private static instance?: WebServer;

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
  public static getInstance(): WebServer {
    if (!this.instance) {
      this.instance = new WebServer();
      console.log("[Dapr-JS] Created WebServerSingleton");
    }


    return this.instance;
  }

  public static async getServer(): Promise<IServerType> {
    const server = await this.getInstance();
    return server.server;
  }

  public static getServerImpl(): IServerImplType {
    const server = this.getInstance();
    return server.serverImpl;
  }

  public static async getServerAddress(): Promise<string> {
    const server = await this.getInstance();
    return server.serverAddress;
  }

  public static async destroy(): Promise<void> {
    if (!this.instance) {
      return;
    }

    const server = await this.getInstance();
    await server.close();
    console.log("[Dapr-JS] Destroyed WebServerSingleton");

    delete this.instance;
  }

  public static async startServer(host: string, port: string): Promise<void> {
    const instance = this.getInstance();
    await instance.startServer(host, port);

    this.instance = instance;

    console.log("[Dapr-JS][HTTP] Created Web Server Singleton");
  }
}