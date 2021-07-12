import { DaprClient, DaprServer } from '../src/grpc';

const daprHost = "127.0.0.1";
const daprPort = "50050"; // Dapr Sidecar Port of this Example Server
const daprPortApp = "50051"; // App Port of this Example Server
const daprPortActor = "10002"; // Dapr Sidecar Port of the Actor Server
const daprAppId = "app-testing";

describe('grpc', () => {
    let server;
    let mockBindingReceive = jest.fn(async (data: object) => console.log("mockBindingReceive"));
    let mockPubSubSubscribe = jest.fn(async (data: object) => console.log("mockPubSubSubscribe"));

    // We need to start listening on some endpoints already
    // this because Dapr is not dynamic and registers endpoints on boot
    beforeAll(async () => {
        server = new DaprServer(daprHost, daprPort, daprPortApp);

        await server.binding.receive("binding-mqtt", mockBindingReceive);
        await server.pubsub.subscribe("pubsub-redis", "test-topic", mockPubSubSubscribe);

        // Start server
        await server.startServer();
    });

    describe('binding', () => {
        it('should be able to receive events', async () => {
            const client = new DaprClient(daprHost, daprPort);
            await client.binding.send("binding-mqtt", "create", { hello: "world" });

            // Delay a bit for event to arrive
            await new Promise((resolve, reject) => setTimeout(resolve, 250));
            expect(mockBindingReceive.mock.calls.length).toBe(1);
        })
    });

    describe('pubsub', () => {
        it('should be able to send and receive events', async () => {
            const client = new DaprClient(daprHost, daprPort);
            await client.pubsub.publish("pubsub-redis", "test-topic", { hello: "world" });

            // Delay a bit for event to arrive
            await new Promise((resolve, reject) => setTimeout(resolve, 250));

            expect(mockPubSubSubscribe.mock.calls.length).toBe(1);
        })
    })
})