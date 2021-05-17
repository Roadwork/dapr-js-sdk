import fetch from 'node-fetch';
import HttpStatusCode from '../enum/HttpStatusCode.enum';
import WebServerSingleton from './WebServer/WebServerSingleton';
import ResponseUtil from '../utils/Response.util';

// https://docs.dapr.io/reference/api/bindings_api/
type FunctionDaprInputCallback = (data: any) => Promise<any>;

export default class DaprBinding {
  daprUrl: string;

  constructor(daprUrl: string) {
    this.daprUrl = daprUrl;
  }

  // Receive an input from an external system
  async receive(bindingName: string, cb: FunctionDaprInputCallback) {
    const server = await WebServerSingleton.getServer();

    console.log(`[Binding] Listening on /${bindingName}`);
    server.post(`/${bindingName}`, async (req, res) => {
      req.setTimeout(60 * 1000); // amount of seconds to wait for the request CB to finalize

      try {
        await cb(req?.body);

        // we send the processing status after we are done processing
        // note: if the callback takes longer than the expected wait time in the queue, it might be that this never gets called
        // @todo: can we do this cleaner without sending the response directly?
        res.statusCode = HttpStatusCode.OK;
        return res.end();
      } catch (e) {
        res.statusCode = HttpStatusCode.INTERNAL_SERVER_ERROR;

        return res.end(JSON.stringify({
          error: "COULD_NOT_PROCESS_CALLBACK",
          error_msg: `Something happened while processing the input binding callback - ${e.message}`
        }));
      }
    });
  }

  // Send an event to an external system
  async send(bindingName: string, data: any, operation: string = "create", metadata: object): Promise<object> {
    const res = await fetch(`${this.daprUrl}/bindings/${bindingName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        operation,
        data,
        metadata
      }),
    });

    return ResponseUtil.handleResponse(res);
  }
}
