/// <reference types="node" />
import http from "http";
import Restana from "restana";
export interface IServerType extends Restana.Service<Restana.Protocol.HTTP> {
}
export interface IRequest extends http.IncomingMessage, Restana.RequestExtensions {
}
export interface IResponse extends http.ServerResponse, Restana.ResponseExtensions {
}
export default class WebServer {
    isInitialized: boolean;
    server: IServerType;
    serverAddress: string;
    constructor();
    getServerAddress(): Promise<string>;
    getServer(): Promise<IServerType>;
    close(): Promise<void>;
    initialize(): Promise<void>;
    private initializeServer;
}
