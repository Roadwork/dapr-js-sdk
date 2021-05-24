import { GetBulkSecretRequest, GetBulkSecretResponse, GetSecretRequest, GetSecretResponse } from "../../proto/dapr/proto/runtime/v1/dapr_pb";
import GRPCClient from './GRPCClient';

// https://docs.dapr.io/reference/api/secrets_api/
export default class DaprSecret {
    client: GRPCClient;

    constructor(client: GRPCClient) {
        this.client = client;
    }

    // @todo: implement metadata
    async get(secretStoreName: string, key: string, metadata: string = ""): Promise<object> {
        const msgService = new GetSecretRequest();
        msgService.setStoreName(secretStoreName);
        msgService.setKey(key);

        return new Promise(async (resolve, reject) => {
            const client = this.client.getClient();
            client.getSecret(msgService, (err, res: GetSecretResponse) => {
                if (err) {
                    return reject(err);
                }

                // https://docs.dapr.io/reference/api/secrets_api/#response-body
                // @ts-ignore
                // tslint:disable-next-line
                return resolve(res.getDataMap()["map_"]);
            });
        })
    }

    async getBulk(secretStoreName: string): Promise<object> {
        const msgService = new GetBulkSecretRequest();
        msgService.setStoreName(secretStoreName);

        return new Promise(async (resolve, reject) => {
            const client = this.client.getClient();
            client.getBulkSecret(msgService, (err, res: GetBulkSecretResponse) => {
                if (err) {
                    return reject(err);
                }

                // https://docs.dapr.io/reference/api/secrets_api/#response-body-1
                // @ts-ignore
                // tslint:disable-next-line
                return resolve(res.getDataMap()["map_"]);
            });
        })
    }
}