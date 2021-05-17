import Dapr, { HttpMethod } from "@roadwork/dapr-js-sdk/grpc";

const daprHost = "127.0.0.1";
const daprPort = 3500;
const daprInternalServerPort = 4000;
const daprAppId = "example-hello-world";

async function start() {
  const client = new Dapr(daprHost, daprPort, daprInternalServerPort);

  await client.invoker.listen("hello-world", async (data: any) => {
    console.log("[Dapr-JS][Example] Received Hello World Method Call");
    console.log(`[Dapr-JS][Example] Data: ${JSON.stringify(data.body)}`);
  }, { method: HttpMethod.POST });
  
  await client.invoker.invoke(daprAppId, "hello-world", HttpMethod.POST, {
    hello: "world"
  });
}

start().catch((e) => {
    console.error(e);
    process.exit(1);
});