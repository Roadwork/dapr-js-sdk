import http, { Server, IncomingMessage, ServerResponse } from "http";
import Restana from "restana";
import bodyParser from "body-parser";
import WebServerImpl from "./WebServerImpl";

// tslint:disable-next-line
export interface IServerImplType extends WebServerImpl { };
// tslint:disable-next-line
export interface IServerType extends Restana.Service<Restana.Protocol.HTTP> {};
// tslint:disable-next-line
export interface IRequest extends http.IncomingMessage, Restana.RequestExtensions { };
// tslint:disable-next-line
export interface IResponse extends http.ServerResponse, Restana.ResponseExtensions { };

export default class WebServer {
    isInitialized: boolean;
    server: IServerType;
    serverAddress: string;
    serverImpl: IServerImplType;

    constructor() {
        this.isInitialized = false;

        this.server = Restana();
        this.server.use(bodyParser.json());

        this.serverImpl = new WebServerImpl();
        
        this.serverAddress = "";
    }

    getServerAddress(): string {
        if (!this.isInitialized) {
            throw new Error(JSON.stringify({
                error: "HTTP_SERVER_NOT_INITIALIZED",
                error_message: "The HTTP server was not initialized, did you call `await HTTPServerSingleton.initialize()`?"
            }));
        }

        return this.serverAddress;
    }

    getServer(): IServerType {
        if (!this.isInitialized) {
            throw new Error(JSON.stringify({
                error: "HTTP_SERVER_NOT_INITIALIZED",
                error_message: "The HTTP server was not initialized, did you call `await HTTPServerSingleton.initialize()`?"
            }));
        }

        return this.server as IServerType;
    }

    // We allow this, since this will register the routes and handlers!
    getServerImpl(): IServerImplType {
        return this.serverImpl;
    }

    async close(): Promise<void> {
        if (!this.isInitialized) {
            throw new Error(JSON.stringify({
                error: "HTTP_SERVER_NOT_INITIALIZED",
                error_message: "The HTTP server was not initialized, did you call `await HTTPServerSingleton.initialize()`?"
            }));
        }

        await this.server.close();
        this.isInitialized = false;
        console.log(`[Dapr-JS] Closed Server`);
    }

    async startServer(host: string, port: string): Promise<void> {
        // Initialize Server Listener
        await this.server.start(parseInt(port, 10));
        console.log(`[Dapr-JS] Listening on ${port}`);
        this.serverAddress = `http://127.0.0.1:${port}`;

        // Add PubSub Routes
        console.log(`[Dapr API][PubSub] Registering ${this.serverImpl.pubSubSubscriptionRoutes.length} PubSub Subscriptions`);
        this.server.get('/dapr/subscribe', (req, res) => {
            res.send(this.serverImpl.pubSubSubscriptionRoutes);
            console.log(`[Dapr API][PubSub] Registered ${this.serverImpl.pubSubSubscriptionRoutes.length} PubSub Subscriptions`);
        })

        // We need to call the Singleton to start listening on the port, else Dapr will not pick it up correctly
        // Dapr will probe every 50ms to see if we are listening on our port: https://github.com/dapr/dapr/blob/a43712c97ead550ca2f733e9f7e7769ecb195d8b/pkg/runtime/runtime.go#L1694
        console.log("Letting Dapr pick-up the server");
        const delayMs = 100;
        await (new Promise((resolve) => setTimeout(resolve, delayMs)));

        // We are initialized
        this.isInitialized = true;
    }
}