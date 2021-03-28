import fetch from 'node-fetch';
import HttpStatusCode from '../enum/HttpStatusCode.enum';
import WebServerSingleton from '../singleton/WebServerSingleton';
import ResponseUtil from '../utils/Response.util';

// https://docs.dapr.io/reference/api/bindings_api/
type FunctionDaprInputCallback = (data: object) => Promise<any>;
export default class DaprBinding {
  daprUrl: string;

  constructor(daprUrl: string) {
    this.daprUrl = daprUrl;
  }

  // Receive an input from an external system
  async receive(bindingName: string, cb: FunctionDaprInputCallback) {
    const server = await WebServerSingleton.getInstance().getServer();

    console.log(`[Binding] Listening on /${bindingName}`);
    server.post(`/${bindingName}`, async (req, res) => {
      req.setTimeout(60 * 1000); // amount of seconds to wait for the request CB to finalize
      
      try {
        await cb(req?.body); 
      } catch (e) {
        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(JSON.stringify({
          error: "COULD_NOT_PROCESS_CALLBACK",
          error_msg: `Something happened while processing the input binding callback - ${e.message}`
        }))
      }

      // we send the processing status after we are done processing
      // note: if the callback takes longer than the expected wait time in the queue, it might be that this never gets called
      // @todo: can we do this cleaner without sending the response directly?
      return res.status(HttpStatusCode.OK).send(); 
    });
  }

  // Send an event to an external system
  async send(bindingName: string, data: any, metadata: object): Promise<object> {
    const res = await fetch(`${this.daprUrl}/bindings/${bindingName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        operation: 'create',
        data,
        metadata
      }),
    });

    return ResponseUtil.handleResponse(res);
  }
}
