import { DaprClient, DaprServer, HttpMethod } from '../src';

import DemoCounterActorImpl from './actor/DemoCounterActorImpl';

const serverHost = "127.0.0.1";
const serverPort = "50051";
const daprHost = "127.0.0.1";
const daprPort = "50050"; // Dapr Sidecar Port of this Example Server
const daprPortActor = "10002"; // Dapr Sidecar Port of the Actor Server
const daprAppId = "test-suite";

describe('grpc', () => {
    let server: DaprServer;
    let mockBindingReceive = jest.fn(async (data: object) => console.log("mockBindingReceive"));
    let mockPubSubSubscribe = jest.fn(async (data: object) => console.log("mockPubSubSubscribe"));

    // We need to start listening on some endpoints already
    // this because Dapr is not dynamic and registers endpoints on boot
    beforeAll(async () => {
        server = new DaprServer(serverHost, serverPort);

        // Start server
        await server.startServer();
    });

    describe('actors', () => {
        it('should be able to register an actor', async () => {
            const server = new DaprServer(serverHost, serverPort);
            server.actor.registerActor(DemoCounterActorImpl);
        })
    });
})