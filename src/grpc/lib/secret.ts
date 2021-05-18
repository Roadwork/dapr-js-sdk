// import fetch from 'node-fetch';
// import ResponseUtil from '../utils/Response.util';

// // https://docs.dapr.io/reference/api/secrets_api/
// export default class DaprSecret {
//   daprUrl: string;

//   constructor(daprUrl: string) {
//     this.daprUrl = daprUrl;
//   }

//   async get(secretStoreName: string, key: string, metadata: string = ""): Promise<object> {
//     const res = await fetch(`${this.daprUrl}/secrets/${secretStoreName}/${key}${metadata ? `?${metadata}` : ""}`);
//     return ResponseUtil.handleResponse(res);
//   }

//   async getBulk(secretStoreName: string, keys: string[], parallelism: number = 10, metadata: string = ""): Promise<object> {
//     const res = await fetch(`${this.daprUrl}/secrets/${secretStoreName}/bulk${metadata ? `?${metadata}` : ""}`, {
//       method: 'POST',
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         keys,
//         parallelism // the number of parallel operations executed on the state store for a get operation
//       })
//     });

//     return ResponseUtil.handleResponse(res);
//   }
// }
