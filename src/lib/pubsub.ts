// https://github.com/dapr/docs/blob/master/reference/api/state_api.md

import fetch from 'node-fetch';
import express from 'express';
import TypeDaprPubSub from './pubsub.type';

export default class DaprPubSub {
  url: string;
  urlDapr: string;
  port: number;
  express: express.Application;

  constructor(express: express.Application, daprUrl: string, daprPort: number) {
    this.url = daprUrl || '127.0.0.1';
    this.port = daprPort || 3500;
    this.express = express;

    if (!this.url.startsWith('http://') && !this.url.startsWith('https://')) {
      this.url = `http://${this.url}`;
    }

    this.urlDapr = `${this.url}:${this.port}/v1.0`;
  }

  async publish(pubSubName: string, topic: string, body: object = {}): Promise<void> {
    const r = await fetch(`${this.urlDapr}/publish/${pubSubName}/${topic}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  }

  subscribe(pubSubName: string, topic: string, cb: TypeDaprPubSub) {
    this.express.use(express.json({ type: 'application/*+json' }));

    this.express.get('/dapr/subscribe', (req, res) => {
      console.log(`[Dapr API][PubSub][route-${topic}] Registering route for queue ${pubSubName}`);

      res.json([
        {
          pubsubname: pubSubName,
          topic,
          route: `route-${topic}`,
        },
      ]);
    });

    this.express.post(`/route-${topic}`, async (req, res) => {
      console.log(`[Dapr API][PubSub][route-${topic}] Handling incoming message`);

      // Process our callback
      await cb(req, res);

      // Let Dapr know that the message was processed correctly
      console.log(`[Dapr API][PubSub][route-${topic}] Ack'ing the message`);
      return res.json({ success: true });
    });
  }
}
