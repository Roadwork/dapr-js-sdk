import WebServer, { IServerType } from "./WebServer";
export default class WebServerSingleton {
    private static instance?;
    /**
     * Private constructor to prevent direct construction calls
     */
    private constructor();
    /**
     * The static method that controls the access to the singleton instance.
     *
     * This implementation let you subclass the Singleton class while keeping
     * just one instance of each subclass around.
     */
    static getInstance(): Promise<WebServer>;
    static getServer(): Promise<IServerType>;
    static getServerAddress(): Promise<string>;
    static destroy(): Promise<void>;
}
