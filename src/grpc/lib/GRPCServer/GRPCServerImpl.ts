import { Server, ServerCredentials } from "@grpc/grpc-js";
import { IAppCallbackServer } from "../../proto/dapr/proto/runtime/v1/appcallback_grpc_pb";
import { InvokeRequest, InvokeResponse } from '../../proto/dapr/proto/common/v1/common_pb';

export default class GRPCServerImpl implements IAppCallbackServer {
    // constructor() {
    // }

    onInvoke(req: InvokeRequest, res: InvokeResponse): void {
        console.log("Got gRPC Invoke Event");
    // this.invoker.onInvoke(req.)
    };

    listTopicSubscriptions: any;
    onTopicEvent: any;
    listInputBindings: any;
    onBindingEvent: any;
}