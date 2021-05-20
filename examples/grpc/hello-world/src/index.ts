import Dapr, { HttpMethod } from "@roadwork/dapr-js-sdk/grpc";

const daprHost = "127.0.0.1";
const daprPort = "50050"; // gRPC Port for Dapr Client
const daprInternalServerPort = "50051"; // gRPC Port for Dapr Server
const daprAppId = "example-hello-world";

async function start() {
  const client = new Dapr(daprHost, daprPort, daprInternalServerPort);

  // console.log("===============================================================");
  // console.log("EXAMPLE: INVOKER API")
  // console.log("===============================================================");
  // await client.invoker.listen("hello-world", async (data: any) => {
  //   console.log("[Dapr-JS][Example] POST /hello-world");
  //   console.log(`[Dapr-JS][Example] Received: ${JSON.stringify(data.body)}`);
  //   console.log(`[Dapr-JS][Example] Replying to Client`);
  //   return { hello: "world received from POST" };
  // }, { method: HttpMethod.POST });

  // await client.invoker.listen("hello-world", async () => {
  //   console.log("[Dapr-JS][Example] GET /hello-world");
  //   console.log(`[Dapr-JS][Example] Replying to Client`);
  //   return { hello: "world received from GET" };
  // }, { method: HttpMethod.GET });
  
  // const r = await client.invoker.invoke(daprAppId, "hello-world", HttpMethod.POST, {
  //   hello: "world"
  // });
  // console.log(r);
  // const r2 = await client.invoker.invoke(daprAppId, "hello-world", HttpMethod.GET);
  // console.log(r2);

  console.log("===============================================================");
  console.log("REGISTERING SERVER HANDLERS")
  console.log("===============================================================");
  await client.pubsub.subscribe("pubsub-redis", "test-topic", async (data: any) => console.log(`[Dapr-JS][Example][PubSub Subscribe CB] Data: ${data}`));
  await client.binding.receive("binding-rabbitmq", async (data: any) => console.log(`[Dapr-JS][Example][Binding Receive CB] Data: ${data}`));


  console.log("===============================================================");
  console.log("INITIALIZING")
  console.log("===============================================================");
  // We initialize after registering our listeners since these should be defined upfront
  // this is how Dapr works, it waits until we are listening on the port. Once that is detected
  // it will scan the binding list and pubsub subscriptions list to process
  await client.initialize();

  // Now we can use the direct methods
  console.log("===============================================================");
  console.log("EXECUTING CLIENT")
  console.log("===============================================================");
  const resBinding = await client.binding.send("binding-rabbitmq", "create", { hello: "world" });
  console.log(`[Dapr-JS][Example][Binding RES] Data: ${JSON.stringify(resBinding)}`);
  const resPubSub = await client.pubsub.publish("pubsub-redis", "test-topic", { hello: "world" });
  console.log(`[Dapr-JS][Example][PubSub RES] Data: ${JSON.stringify(resPubSub)}`);
}

start().catch((e) => {
    console.error(e);
    process.exit(1);
});