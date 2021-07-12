import fetch from "node-fetch";

export default class GRPCClient {
    isInitialized: boolean;
    client: typeof fetch;
    clientHost: string;
    clientPort: string;
    clientUrl: string;

    constructor(host: string = "127.0.0.1", port: string = "50050") {
        this.isInitialized = true;
        this.clientHost = host;
        this.clientPort = port;

        if (!this.clientHost.startsWith('http://') && !this.clientHost.startsWith('https://')) {
            this.clientUrl = `http://${this.clientHost}:${this.clientPort}/v1.0`;
        } else {
            this.clientUrl = `${this.clientHost}:${this.clientPort}/v1.0`;
        }

        this.client = fetch;
    }

    async execute(url: string, ...params: any): Promise<any> {
        return await fetch(`${this.clientUrl}${url}`, ...params);
    }
}