import * as grpc from "@grpc/grpc-js";
import { IAppCallbackServer } from "../../proto/dapr/proto/runtime/v1/appcallback_grpc_pb";
import { HTTPExtension, InvokeRequest, InvokeResponse } from '../../proto/dapr/proto/common/v1/common_pb';
import { Any } from "../../proto/google/protobuf/any_pb";
import { TypeDaprInvokerCallback } from "../../types/DaprInvokerCallback.type";
import * as HttpVerbUtil from "../../utils/HttpVerb.util";

export default class GRPCServerImpl implements IAppCallbackServer {
    handlersInvoke: { [key: string]: TypeDaprInvokerCallback };

    constructor() {
        this.handlersInvoke = {};
    }

    async onInvoke(call: grpc.ServerUnaryCall<InvokeRequest, InvokeResponse>, callback: grpc.sendUnaryData<InvokeResponse>): Promise<void> {
        const method = call.request.getMethod();
        const query = (call.request.getHttpExtension() as HTTPExtension).toObject();
        const methodStr = HttpVerbUtil.convertHttpVerbNumberToString(query.verb);
        const handlersInvokeKey = `${methodStr.toLowerCase()}-${method.toLowerCase()}`;

        if (!this.handlersInvoke[handlersInvokeKey]) {
            console.error(`[Dapr-JS][gRPC][Invoker] ${methodStr} /${method} was not handled`);
            return;
        }

        const body = Buffer.from((call.request.getData() as Any).getValue()).toString();
        const contentType = call.request.getContentType();

        // Invoke the Method Callback
        const invokeResponseData = await this.handlersInvoke[handlersInvokeKey]({
            body,
            query: query.querystring,
            metadata: {
                contentType
            }
        });

        // Generate Response
        const res = new InvokeResponse();
        res.setContentType("application/json");

        if (invokeResponseData) {
            const msgSerialized = new Any();
            msgSerialized.setValue(Buffer.from(JSON.stringify(invokeResponseData), "utf-8"));
            res.setData(msgSerialized);
        }

        return callback(null, res);
    }

    onInvokeRegisterHandler(httpMethod: string, methodName: string, cb: TypeDaprInvokerCallback): void {
        const handlersInvokeKey = `${httpMethod.toLowerCase()}-${methodName.toLowerCase()}`;
        this.handlersInvoke[handlersInvokeKey] = cb;
    }

    listTopicSubscriptions: any;
    onTopicEvent: any;
    listInputBindings: any;
    onBindingEvent: any;
}