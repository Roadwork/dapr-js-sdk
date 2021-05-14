import { Response } from "node-fetch";
export default class ResponseUtil {
    static handleResponse(res: Response): Promise<object>;
}
