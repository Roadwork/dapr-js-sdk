# Dapr Node.js SDK

This is an unofficial [Dapr](https://dapr.io) Node.js SDK that allows interfacing with Dapr applications. The release is to demonstrate the possible way of structuring the SDK for community use.

> **Note:** This library is not ready for production yet

## Usage

Initialize through the following:

```javascript
import Dapr from "@roadwork/dapr-js-sdk";
import express from "express";

const client = new Dapr();

// Pub / Sub
const bindingReceive = (data: any) => { console.log(data); }
client.pubsub.subscribe("pubsub-name", "topic", bindingReceive.bind(this))
await client.pubsub.publish("pubsub-name", "topic", { hello: "world" });

// State
const keys = [{ "key": "value" }, { "key2": "value2" }]; // IKeyValuePair[]
await client.state.save("store-name", );
await client.state.get("store-name", "key");
await client.state.delete("store-name", "key");

// Binding
const bindingReceive = (data: any) => { console.log(data); }
client.binding.receive("binding-name", bindingReceive.bind(this))
await client.binding.send("binding-name", { hello: "world" });

// Invoke
await client.invoke("app-id", "method", { hello: "world" });
```