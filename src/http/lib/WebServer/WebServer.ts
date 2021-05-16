import http, { Server, IncomingMessage, ServerResponse } from "http";
import Restana from "restana";
import bodyParser from "body-parser";

export interface IServerType extends Restana.Service<Restana.Protocol.HTTP> {};
export interface IRequest extends http.IncomingMessage, Restana.RequestExtensions { };
export interface IResponse extends http.ServerResponse, Restana.ResponseExtensions { };

export default class WebServer {
    isInitialized: boolean;
    server: IServerType;
    serverAddress: string;

    constructor() {
        this.isInitialized = false;

        this.server = Restana();
        this.server.use(bodyParser.json());
        
        this.serverAddress = "";
    }

    async getServerAddress(): Promise<string> {
        if (!this.isInitialized) {
            await this.initialize();
        }

        return this.serverAddress;
    }

    async getServer(): Promise<IServerType> {
        if (!this.isInitialized) {
            await this.initialize();
        }

        // throw new Error(JSON.stringify({
        //   code: 'WEB_SERVER_NOT_INITIALIZED',
        //   message: "The WebServerSingleton instance was not initialized, did you run `await myClass.getInstance().initialize()`?"
        // }));

        return this.server as IServerType;
    }

    async close(): Promise<void> {
        await this.server.close();
        this.isInitialized = false;
        console.log(`[Dapr-JS] Closed Server`);
    }

    async initialize(): Promise<void> {
        // Get the App Port as set in the Dapr constructor
        const randomPort = Math.floor(Math.random() * (20000 - 10000 + 1)) + 10000;
        const appPort = parseInt(process.env.DAPR_INTERNAL_SERVER_PORT || "", 10) || randomPort;
        await this.initializeServer(appPort);

        // We need to call the Singleton to start listening on the port, else Dapr will not pick it up correctly
        // Dapr will probe every 50ms to see if we are listening on our port: https://github.com/dapr/dapr/blob/a43712c97ead550ca2f733e9f7e7769ecb195d8b/pkg/runtime/runtime.go#L1694
        console.log("Letting Dapr pick-up the server");
        const delayMs = 100;
        await (new Promise((resolve) => setTimeout(resolve, delayMs)));

        // We are initialized
        this.isInitialized = true;
    }

    private async initializeServer(port?: number): Promise<void> {
        await this.server.start(port);
        console.log(`[Dapr-JS] Listening on ${port}`);
        this.serverAddress = `http://127.0.0.1:${port}`;
    }
}