// https://docs.dapr.io/reference/api/pubsub_api/

import fetch from 'node-fetch';
import express from 'express';
import TypeDaprPubSub from '../types/IDaprInvoker';

export default class DaprPubSub {
  daprUrl: string;
  express: express.Application;

  constructor(express: express.Application, daprUrl: string) {
    this.express = express;
    this.daprUrl = daprUrl;
  }

  async publish(pubSubName: string, topic: string, body: object = {}): Promise<number> {
    const res = await fetch(`${this.daprUrl}/publish/${pubSubName}/${topic}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // Returns 200 or 500
    return res.status;
  }

  subscribe(pubSubName: string, topic: string, cb: TypeDaprPubSub) {
    this.express.use(express.json({ type: 'application/*+json' }));

    this.express.get('/dapr/subscribe', (req, res) => {
      console.log(`[Dapr API][PubSub][route-${topic}] Registering route for queue ${pubSubName}`);

      res.json([
        {
          pubsubname: pubSubName,
          topic,
          route: `route-${pubSubName}-${topic}`,
        },
      ]);
    });

    this.express.post(`/route-${pubSubName}-${topic}`, async (req, res) => {
      console.log(`[Dapr API][PubSub][route-${topic}] Handling incoming message`);

      // Process our callback
      await cb(req, res);

      // Let Dapr know that the message was processed correctly
      console.log(`[Dapr API][PubSub][route-${topic}] Ack'ing the message`);
      return res.json({ success: true });
    });
  }
}
