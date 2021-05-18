// import fetch from 'node-fetch';
// import WebServerSingleton from "./GRPCServer/GRPCServerSingleton";
// import { TypeDaprPubSub } from '../types/DaprPubSub.type';

// // https://docs.dapr.io/reference/api/pubsub_api/
// export default class DaprPubSub {
//   daprUrl: string;

//   constructor(daprUrl: string) {
//     this.daprUrl = daprUrl;
//   }

//   async publish(pubSubName: string, topic: string, body: object = {}): Promise<number> {
//     const res = await fetch(`${this.daprUrl}/publish/${pubSubName}/${topic}`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(body),
//     });

//     // Returns 200 or 500
//     return res.status;
//   }

//   async subscribe(pubSubName: string, topic: string, cb: TypeDaprPubSub) {
//     const server = await WebServerSingleton.getServer();

//     server.get('/dapr/subscribe', (req, res) => {
//       console.log(`[Dapr API][PubSub][route-${topic}] Registering route for queue ${pubSubName}`);

//       res.send([
//         {
//           pubsubname: pubSubName,
//           topic,
//           route: `route-${pubSubName}-${topic}`,
//         },
//       ]);
//     });

//     server.post(`/route-${pubSubName}-${topic}`, async (req, res) => {
//       // console.log(`[Dapr API][PubSub][route-${topic}] Handling incoming message`);

//       // Process our callback
//       await cb(req, res);

//       // Let Dapr know that the message was processed correctly
//       // console.log(`[Dapr API][PubSub][route-${topic}] Ack'ing the message`);
//       return res.send({ success: true });
//     });
//   }
// }
