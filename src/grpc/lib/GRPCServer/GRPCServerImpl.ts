import * as grpc from "@grpc/grpc-js";
import { IAppCallbackServer } from "../../proto/dapr/proto/runtime/v1/appcallback_grpc_pb";
import { HTTPExtension, InvokeRequest, InvokeResponse } from '../../proto/dapr/proto/common/v1/common_pb';
import { Any } from "../../proto/google/protobuf/any_pb";
import { Empty } from "../../proto/google/protobuf/empty_pb";
import { TypeDaprInvokerCallback } from "../../types/DaprInvokerCallback.type";
import * as HttpVerbUtil from "../../utils/HttpVerb.util";
import { BindingEventRequest, BindingEventResponse, ListInputBindingsResponse, ListTopicSubscriptionsResponse, TopicEventRequest, TopicEventResponse, TopicSubscription } from "../../proto/dapr/proto/runtime/v1/appcallback_pb";
import { TypeDaprBindingCallback } from "../../types/DaprBindingCallback.type";
import { TypeDaprPubSubCallback } from "../../types/DaprPubSubCallback.type";

export default class GRPCServerImpl implements IAppCallbackServer {
    handlersInvoke: { [key: string]: TypeDaprInvokerCallback };
    handlersBindings: { [key: string]: TypeDaprBindingCallback };
    handlersTopics: { [key: string]: TypeDaprPubSubCallback };

    constructor() {
        this.handlersInvoke = {};
        this.handlersBindings = {};
        this.handlersTopics = {};
    }

    registerOnInvokeHandler(httpMethod: string, methodName: string, cb: TypeDaprInvokerCallback): void {
        const handlerKey = `${httpMethod.toLowerCase()}|${methodName.toLowerCase()}`;
        this.handlersInvoke[handlerKey] = cb;
    }

    registerPubSubSubscriptionHandler(pubSubName: string, topicName: string, cb: TypeDaprInvokerCallback): void {
        const handlerKey = `${pubSubName}|${topicName}`;
        this.handlersTopics[handlerKey] = cb;
    }

    registerInputBindingHandler(bindingName: string, cb: TypeDaprInvokerCallback): void {
        const handlerKey = `${bindingName}`;
        this.handlersBindings[handlerKey] = cb;
    }

    async onInvoke(call: grpc.ServerUnaryCall<InvokeRequest, InvokeResponse>, callback: grpc.sendUnaryData<InvokeResponse>): Promise<void> {
        const method = call.request.getMethod();
        const query = (call.request.getHttpExtension() as HTTPExtension).toObject();
        const methodStr = HttpVerbUtil.convertHttpVerbNumberToString(query.verb);
        const handlersInvokeKey = `${methodStr.toLowerCase()}|${method.toLowerCase()}`;

        if (!this.handlersInvoke[handlersInvokeKey]) {
            console.warn(`[Dapr-JS][gRPC][Invoke] ${methodStr} /${method} was not handled`);
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

    // @todo: WIP
    async onBindingEvent(call: grpc.ServerUnaryCall<BindingEventRequest, BindingEventResponse>, callback: grpc.sendUnaryData<BindingEventResponse>): Promise<void> {
        const req = call.request;
        const handlerKey = `${req.getName()}`;
        
        if (!this.handlersBindings[handlerKey]) {
            console.warn(`[Dapr-JS][gRPC][Bindings] Event for binding: "${handlerKey}" was not handled`);
            return;
        }

        const data = Buffer.from(req.getData()).toString();
        await this.handlersBindings[handlerKey](data);

        // @todo: we should add the state store or output binding binding
        // see: https://docs.dapr.io/reference/api/bindings_api/#binding-endpoints
        const res = new BindingEventResponse();
        return callback(null, res);
    }

    // @todo: WIP
    async onTopicEvent(call: grpc.ServerUnaryCall<TopicEventRequest, TopicEventResponse>, callback: grpc.sendUnaryData<TopicEventResponse>): Promise<void> {
        const req = call.request;
        const handlerKey = `${req.getPubsubName()}|${req.getTopic()}`;
        
        if (!this.handlersTopics[handlerKey]) {
            console.warn(`[Dapr-JS][gRPC][PubSub] Event from topic: "${handlerKey}" was not handled`);
            return;
        }

        const data = Buffer.from(req.getData()).toString();
        const res = new TopicEventResponse();

        try {
            await this.handlersTopics[handlerKey](data);
            res.setStatus(TopicEventResponse.TopicEventResponseStatus.SUCCESS);
        } catch (e) {
            // @todo: for now we drop, maybe we should allow retrying as well more easily?
            res.setStatus(TopicEventResponse.TopicEventResponseStatus.DROP);
        }

        return callback(null, res);
    }

    // @todo: WIP
    async listTopicSubscriptions(call: grpc.ServerUnaryCall<Empty, ListTopicSubscriptionsResponse>, callback: grpc.sendUnaryData<ListTopicSubscriptionsResponse>): Promise<void> {
        const res = new ListTopicSubscriptionsResponse();

        const values = Object.keys(this.handlersTopics).map((i) => {
            const handlerTopic = i.split("|");

            const topicSubscription = new TopicSubscription();
            topicSubscription.setPubsubName(handlerTopic[0]);
            topicSubscription.setTopic(handlerTopic[1]);

            return topicSubscription;
        });

        res.setSubscriptionsList(values);

        return callback(null, res);
    }

    // @todo: WIP
    async listInputBindings(call: grpc.ServerUnaryCall<Empty, ListInputBindingsResponse>, callback: grpc.sendUnaryData<ListInputBindingsResponse>): Promise<void> {
        const res = new ListInputBindingsResponse();
        res.setBindingsList(Object.keys(this.handlersBindings));
        return callback(null, res);
    }
}