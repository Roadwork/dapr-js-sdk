import { DaprClient, DaprServer } from '../../src';

import DemoCounterActorImpl from '../actor/DemoCounterActorImpl';

const serverHost = "127.0.0.1";
const serverPort = "50051";

describe('grpc', () => {
    let server: DaprServer;

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