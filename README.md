# Dapr Node.js SDK

This is an unofficial [Dapr](https://dapr.io) Node.js SDK that allows interfacing with Dapr applications. The release is to demonstrate the possible way of structuring the SDK for community use.

It will spin up an internal web server for receive actions (e.g. Method Invocation receiving, Subscribe actions, ...) which are being published by the port described through the environment variable `DAPR_APP_PORT` or a random allocated port if this is not set.

> **Note:** This library is not ready for production yet

## Usage

Initialize through the following:

```javascript
import Dapr from "@roadwork/dapr-js-sdk";
import express from "express"; // starts the dapr listener on the app port

const client = new Dapr("<dapr_url>", "<dapr_port>");
await client.initialize();

// Pub / Sub
const bindingReceive = (data: any) => { console.log(data); }
client.pubsub.subscribe("pubsub-name", "topic", bindingReceive.bind(this))
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

const invokerListen = (req: express.Request, res: express.Response) => { console.log(data); }
await client.invoker.listen("method", invokerListen.bind(this), options)

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
