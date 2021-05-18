import Dapr, { HttpMethod } from "@roadwork/dapr-js-sdk/grpc";

const daprHost = "127.0.0.1";
const daprPort = "50050"; // gRPC Port for Dapr Client
const daprInternalServerPort = "50051"; // gRPC Port for Dapr Server
const daprAppId = "example-hello-world";

async function start() {
  const client = new Dapr(daprHost, daprPort, daprInternalServerPort);
  await client.initialize();

  await client.invoker.listen("hello-world", async (data: any) => {
    console.log("[Dapr-JS][Example] POST /hello-world");
    console.log(`[Dapr-JS][Example] Received: ${JSON.stringify(data.body)}`);
    console.log(`[Dapr-JS][Example] Replying to Client`);
    return { hello: "world received from POST" };
  }, { method: HttpMethod.POST });

  await client.invoker.listen("hello-world", async () => {
    console.log("[Dapr-JS][Example] GET /hello-world");
    console.log(`[Dapr-JS][Example] Replying to Client`);
    return { hello: "world received from GET" };
  }, { method: HttpMethod.GET });
  
  const r = await client.invoker.invoke(daprAppId, "hello-world", HttpMethod.POST, {
    hello: "world"
  });
  console.log(r);
  const r2 = await client.invoker.invoke(daprAppId, "hello-world", HttpMethod.GET);
  console.log(r2);
}

start().catch((e) => {
    console.error(e);
    process.exit(1);
});