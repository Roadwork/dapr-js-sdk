# Dapr Node.js SDK

This is an unofficial [Dapr](https://dapr.io) Node.js SDK that allows interfacing with Dapr applications. The release is to demonstrate the possible way of structuring the SDK for community use.

It will spin up an internal web server for receive actions (e.g. Method Invocation receiving, Subscribe actions, ...) which are being published by the port described through the environment variable `DAPR_APP_PORT` or a random allocated port if this is not set.

> **Note:** This library is not ready for production yet

## Usage

1. Set the environment variable `DAPR_APP_PORT` to equal to the app port

e.g. `DAPR_APP_PORT=4000 dapr run --app-id hello-world --app-port 4000 --dapr-http-port 3500 --components-path ./components/ npm run start:dev`

2. Initialize through the following:

```javascript
import Dapr, { Req, Res } from "@roadwork/dapr-js-sdk";

// Dapr ConnectionInfo
// daprUrl: the url to the Dapr Sidecar
// daprPort: the port to the Dapr Sidecar
const daprUrl = "127.0.0.1";
const daprPort = 3500; 

// Internal Server Port
// This library spins up an internal webserver running fastify
// We use this internal webserver for listening to dapr specific actions (e.g. method invocation, pub/sub, ...)
// Note: make sure to utilize --app-port <daprInternalServerPort> if you don't run your own web server
const daprInternalServerPort = 4000; 

const client = new Dapr(daprUrl, daprPort, daprInternalServerPort);

// Pub / Sub
// Note: /dapr/subscribe will be called on the provided DAPR_APP_PORT and --app-port values. 
// if you are running an extra HTTP server, make sure to utilize a different port. Dapr will not wait till your app started, which is not required since the library takes care of Dapr related functionality internally.
const pubsubCallback = async (data: any) => { console.log(data); }
client.pubsub.subscribe("pubsub-name", "topic", pubsubCallback.bind(this))
await client.pubsub.publish("pubsub-name", "topic", { hello: "world" });

// State
const keys = [{ "key": "value" }, { "key2": "value2" }]; // IKeyValuePair[]
await client.state.save("store-name", );
await client.state.get("store-name", "key");
await client.state.delete("store-name", "key");
await client.state.getBulk("store-name", [ "key1", "key2" ]);

const stateOperations = [
  {
    operation: "upsert",
    request: {
      key: "key1",
      value: "myData"
    }
  }
]
await client.state.transaction("store-name", stateOperations)

// Binding
const bindingReceive = (data: any) => { console.log(data); }
await client.binding.receive("binding-name", bindingReceive.bind(this))
await client.binding.send("binding-name", { hello: "world" });

// Invoke
await client.invoker.invoke("app-id", "method", { hello: "world" });

const invokerListen = (req: Req, res: Res) => { console.log(data); }
await client.invoker.listen("method", invokerListen.bind(this), options);

// Secrets
await client.secret.get("secret-store-name", "key");
await client.secret.getBulk("secret-store-name", [ "key1", "key2" ]);

// Actors
await client.actor.invoke("GET", "actor-type", "actor-id", "method");
await client.actor.stateTransaction("actor-type", "actor-id", [{
  operation: "upsert",
  request: {
    key: "key1",
    value: "myData"
  }
}])
await client.actor.stateGet("actor-type", "actor-id", "key");
await client.actor.reminderCreate("actor-type", "actor-id", "name");
await client.actor.reminderGet("actor-type", "actor-id", "name");
await client.actor.reminderDelete("actor-type", "actor-id", "name");
await client.actor.timerCreate("actor-type", "actor-id", "name");
await client.actor.timerDelete("actor-type", "actor-id", "name");
```

## Development

### Installation

```bash
npm install
npm run test
```

## Reference

### Service Invocation

The service invocation methods are created as a warpper on the [Dapr Service Invocation API](https://docs.dapr.io/reference/api/service_invocation_api/).

#### Invoking a method

```javascript
await client.invoker.invoke("app-id", "method", { hello: "world" });
```

#### Listening to a method call

On top of the invoking, this SDK also implements a trivial way to listen to app invocations. Instead of creating your own Express server, you can simply run the following commands which will listen to calls coming in on the provided endpoint.

```javascript
const invokerListen = (req: express.Request, res: express.Response) => { console.log(data); }
await client.invoker.listen("method", invokerListen.bind(this), options)
```

### State Management

### Pub/Sub

### Bindings

### Actors

### Secrets
