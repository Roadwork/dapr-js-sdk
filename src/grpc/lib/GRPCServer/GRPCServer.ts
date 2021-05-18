import * as grpc from "@grpc/grpc-js";
import http from "http";
import GRPCServerImpl from "./GRPCServerImpl";
import { AppCallbackService } from "../../proto/dapr/proto/runtime/v1/appcallback_grpc_pb";
import { DaprClient } from "../../proto/dapr/proto/runtime/v1/dapr_grpc_pb"

// tslint:disable-next-line
export interface IServerType extends grpc.Server {};
// tslint:disable-next-line
export interface IServerImplType extends GRPCServerImpl {};
// tslint:disable-next-line
export interface IRequest extends http.IncomingMessage { };
// tslint:disable-next-line
export interface IResponse extends http.ServerResponse { };

export default class GRPCServer {
    isInitialized: boolean;
    serverHost: string;
    serverPort: string;
    server: IServerType;
    serverImpl: IServerImplType;
    serverCredentials: grpc.ServerCredentials;

    constructor(host: string, port: string) {
        this.isInitialized = false;
        this.serverHost = host;
        this.serverPort = port;
        
        // Create Server
        this.server = new grpc.Server();
        this.serverCredentials = grpc.ServerCredentials.createInsecure();
        this.serverImpl = new GRPCServerImpl();

        // Add our implementation
        console.log("[Dapr-JS][gRPC] Adding Service Implementation - AppCallbackService")
        // @ts-ignore
        this.server.addService(AppCallbackService, this.serverImpl);
    }

    async getServerAddress(): Promise<string> {
        if (!this.isInitialized) {
            await this.initialize();
        }

        return `${this.serverHost}:${this.serverPort}`;
    }

    async getServer(): Promise<IServerType> {
        if (!this.isInitialized) {
            await this.initialize();
        }

        return this.server as IServerType;
    }

    async getServerImpl(): Promise<IServerImplType> {
        if (!this.isInitialized) {
            await this.initialize();
        }

        return this.serverImpl;
    }

    async close(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.server.tryShutdown((err) => {
                if (err) {
                    return reject(err);
                }
                
                console.log(`[Dapr-JS][gRPC] Closed Server`);
                this.isInitialized = false;

                return resolve();
            })
        })
    }

    async initialize(): Promise<void> {
        await this.initializeBind();
        this.server.start();

        // We need to call the Singleton to start listening on the port, else Dapr will not pick it up correctly
        // Dapr will probe every 50ms to see if we are listening on our port: https://github.com/dapr/dapr/blob/a43712c97ead550ca2f733e9f7e7769ecb195d8b/pkg/runtime/runtime.go#L1694
        console.log("[Dapr-JS][gRPC] Letting Dapr pick-up the server");
        const delayMs = 100;
        await (new Promise((resolve) => setTimeout(resolve, delayMs)));

        // We are initialized
        this.isInitialized = true;
    }

    private async initializeBind(): Promise<void> {
        console.log(`[Dapr-JS][gRPC] Starting to listen on ${this.serverHost}:${this.serverPort}`);
        return new Promise((resolve, reject) => {
            this.server.bindAsync(`${this.serverHost}:${this.serverPort}`, this.serverCredentials, (err, port) => {
                if (err) {
                    return reject(err);
                }
                
                console.log(`[Dapr-JS][gRPC] Listening on ${this.serverHost}:${this.serverPort}`);
                return resolve();
            });
        })
    }
}