import Dapr, { HttpMethod } from "@roadwork/dapr-js-sdk/http";
import { TypeDaprPubSub, TypeElementOfDaprPubSub } from '@roadwork/dapr-js-sdk/http/types/DaprPubSub.type';

const daprHost = "127.0.0.1";
const daprPort = 3500;
const daprInternalServerPort = 4000;
const daprAppId = "example-hello-world";

async function start() {
  const client = new Dapr(daprHost, daprPort, daprInternalServerPort);
  let testPubSubCallback:TypeDaprPubSub = async (req,res)=>{
    console.log("sub result is here")
  }
  const subArray : TypeElementOfDaprPubSub[]= [{
    pubSubName:"pubsub",
    topic:"test",
    route:"pubsubTest",
    cb:testPubSubCallback
  }];
  await client.pubsub.subscribe(subArray)
  await client.invoker.listen("hello-world", async (data: any) => {
    console.log("[Dapr-JS][Example] Received Hello World Method Call");
    console.log(`[Dapr-JS][Example] Data: ${JSON.stringify(data)}`);
  }, { method: HttpMethod.POST });
  await client.start()
  await client.invoker.invoke(daprAppId, "hello-world", HttpMethod.POST, {
    hello: "world"
  });
  
}

start().catch((e) => {
    console.error(e);
    process.exit(1);
});