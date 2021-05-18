import fetch from 'node-fetch';
import WebServerSingleton from "./WebServer/WebServerSingleton";
import { TypeDaprPubSub, TypeElementOfDaprPubSub } from '../types/DaprPubSub.type';

// https://docs.dapr.io/reference/api/pubsub_api/
export default class DaprPubSub {
  daprUrl: string;

  constructor(daprUrl: string) {
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

  async subscribe(subs: TypeElementOfDaprPubSub[]) {
    const server = await WebServerSingleton.getServer();
    if (subs.length < 1) return;
    
    subs.forEach((sub: TypeElementOfDaprPubSub, i) => {
     
      server.post(`/${sub.route}`, async (req, res) => {
        console.log(`[Dapr API][PubSub][route-${sub.topic}] Handling incoming message`);

        // Process our callback
        await sub.cb(req, res);

        // Let Dapr know that the message was processed correctly
        // console.log(`[Dapr API][PubSub][route-${topic}] Ack'ing the message`);
        return res.send({ success: true });
      });
    });

    server.get('/dapr/subscribe', (req, res) => {
      console.log(`[Dapr API][PubSub] Registering`);
      let subsCopy : TypeElementOfDaprPubSub[] = JSON.parse(JSON.stringify(subs));
      subsCopy = subsCopy.map((row:TypeElementOfDaprPubSub)=>{
        row.cb = null;
        return row
      })
      res.send(subsCopy);
    });


  }
}
