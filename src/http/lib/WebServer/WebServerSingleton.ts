import WebServer, { IServerType } from "./WebServer";

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
  public static async getInstance(withoutInit:boolean=false): Promise<WebServer> {
    if (!this.instance) {
      this.instance = new WebServer();
      console.log("[Dapr-JS] Created WebServerSingleton");
    }

    if (!withoutInit && !this.instance.isInitialized) {
      await this.instance.initialize();
    }

    return this.instance;
  }

  public static async getServer(withoutInit:boolean=false): Promise<IServerType> {
    const server = await this.getInstance(withoutInit);
    return server.server;
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
}