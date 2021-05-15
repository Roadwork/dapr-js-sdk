import * as dapr from "../src/index";
const { ListTopicSubscriptionsResponse } = require("../src/dapr/proto/runtime/v1/appcallback_pb");
const messages = dapr.dapr_pb;
const services = dapr.dapr_grpc;
const commonMessages = dapr.common_pb;
const appcallback_grpc_pb = dapr.daprclient_grpc;
const appcallback_pb = dapr.daprclient_pb;
//const grpc = dapr.grpc;
import {Server,ChannelCredentials,ServerUnaryCall,sendUnaryData,ServerCredentials,ServiceDefinition,UntypedServiceImplementation} from "@grpc/grpc-js"
import * as daprdef from "../src/main"
const server = new Server();
const my_listTopicSubscriptions = (call, cb) => {
    //console.log("hii fom list ",call)
    const list = new appcallback_pb.ListTopicSubscriptionsResponse();
    const topic = new appcallback_pb.TopicSubscription();
    topic.setTopic("sith")
    topic.setPubsubName("pubsub")
    list.addSubscriptions(topic)
    cb(null, list)
}
const my_onTopicEvent = (call,cb) => {
    if(call.request){
        console.log(call.request.toObject().data)
    }
}

server.addService(appcallback_grpc_pb.AppCallbackService as ServiceDefinition<UntypedServiceImplementation>,
    {
        listTopicSubscriptions:my_listTopicSubscriptions,
        onTopicEvent:my_onTopicEvent
    });
server.bindAsync('127.0.0.1:3000',ServerCredentials.createInsecure(), (e, p) => {
      if (!e) server.start();
})



var client = new services.DaprClient(
    `127.0.0.1:50001`, ChannelCredentials.createInsecure());

var event = new messages.PublishEventRequest();
event.setTopic('sith');
event.setPubsubName('pubsub');

const data = 'lala';
event.setData(data);

client.publishEvent(event, (err, response) => {
    if (err) {
        console.log(`Error publishing! ${err}`);
    } else {
        console.log('Published!');
    }
});
/*
// Invoke output binding named 'storage'
var binding = new messages.InvokeBindingRequest();
binding.setName('storage');
binding.setData(data);
binding.setOperation('create')
var metaMap = binding.getMetadataMap();
metaMap.set("key", "val");

client.invokeBinding(binding, (err, response) => {
    if (err) {
        console.log(`Error binding: ${err}`);
    } else {
        console.log('Bound!');
    }
});
*/
// receiver-app is not implemented yet
/*
var invoke = new messages.InvokeServiceRequest();
invoke.setId('receiver-app');
var msg = new commonMessages.InvokeRequest();
msg.setMethod('my-method');
var serialized = new proto.google.protobuf.Any();
serialized.setValue(Buffer.from(JSON.stringify({
    data: {
        orderId: 1
    }
}), 'utf-8'));
msg.setData(serialized);
// Comment this block if receiver-app is using gRPC protocol
msg.setContentType('application/json');
var ext = new proto.dapr.proto.common.v1.HTTPExtension();
ext.setVerb(commonMessages.HTTPExtension.Verb.POST);
msg.setHttpExtension(ext);
invoke.setMessage(msg);
client.invokeService(invoke, (err, response) => {
    if (err) {
        console.log(`Error invoking service: ${err}`);
    } else {
        console.log('Invoked!');
    }
});
*/

var key = 'mykey';
var storeName = 'statestore';

var stateReq = new messages.SaveStateRequest();
stateReq.setStoreName(storeName);
var states = [new commonMessages.StateItem()];
states[0].setKey(key);
states[0].setValue(Buffer.from('My State', 'utf-8'));

stateReq.setStatesList(states)

client.saveState(stateReq, (err, res) => {
    if (err) {
        console.log(`Error saving state: ${err}`);
    } else {
        console.log('Saved!');

        // saved, now do a get, promises would clean this up...
        var get = new messages.GetStateRequest();
        get.setStoreName(storeName)
        get.setKey(key);
        client.getState(get, (err, response) => {
            if (err) {
                console.log(`Error getting state: ${err}`);
            } else {
                console.log('Got!');
                console.log(String.fromCharCode.apply(null, response.getData()));

                // get done, now delete, again promises would be nice...
                var del = new messages.DeleteStateRequest();
                del.setStoreName(storeName)
                del.setKey(key);
                client.deleteState(del, (err, response) => {
                    if (err) {
                        console.log(`Error deleting state: ${err}`);
                    } else {
                        console.log('Deleted!');
                    }
                });
            }
        });
    }
});