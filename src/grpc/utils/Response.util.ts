import HttpStatusCode from "../enum/HttpStatusCode.enum";
import ErrorUtil from "./Error.util";
import { Response } from "node-fetch";

export default class ResponseUtil {
  static async handleResponse(res: Response): Promise<object> {
    switch (res.status) {
      case HttpStatusCode.OK: { // OK 
        const json = await res.json();
        return json;
      }

      case HttpStatusCode.NO_CONTENT: {
        return {};
      }

      case HttpStatusCode.BAD_REQUEST: {
        const json = await res.json();
        ErrorUtil.serializeError(json); // throws error
        break;
      }

      case HttpStatusCode.INTERNAL_SERVER_ERROR: {
        const json = await res.json();
        ErrorUtil.serializeError(json); // throws error
        break;
      }
    }

    return {};
  }
}