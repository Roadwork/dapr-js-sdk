import { GetBulkSecretRequest, GetBulkSecretResponse, GetSecretRequest, GetSecretResponse } from "../proto/dapr/proto/runtime/v1/dapr_pb";
import GRPCClientSingleton from "./GRPCClient/GRPCClientSingleton";

// https://docs.dapr.io/reference/api/secrets_api/
export default class DaprSecret {
    // @todo: implement metadata
    async get(secretStoreName: string, key: string, metadata: string = ""): Promise<object> {
        const msgService = new GetSecretRequest();
        msgService.setStoreName(secretStoreName);
        msgService.setKey(key);

        return new Promise(async (resolve, reject) => {
            const client = await GRPCClientSingleton.getClient();
            client.getSecret(msgService, (err, res: GetSecretResponse) => {
                if (err) {
                    return reject(err);
                }

                // https://docs.dapr.io/reference/api/secrets_api/#response-body
                return resolve(res.getDataMap()?.map_[key]);
            });
        })
    }

    async getBulk(secretStoreName: string): Promise<object> {
        const msgService = new GetBulkSecretRequest();
        msgService.setStoreName(secretStoreName);

        return new Promise(async (resolve, reject) => {
            const client = await GRPCClientSingleton.getClient();
            client.getBulkSecret(msgService, (err, res: GetBulkSecretResponse) => {
                if (err) {
                    return reject(err);
                }

                // https://docs.dapr.io/reference/api/secrets_api/#response-body-1
                return resolve(res.getDataMap()?.map_);
            });
        })
    }
}
