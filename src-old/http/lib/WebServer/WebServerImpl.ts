interface PubSubSubscriptionRoute {
    pubsubname: string;
    topic: string;
    route: string;
}

export default class WebServerImpl {
    pubSubSubscriptionRoutes: PubSubSubscriptionRoute[];

    constructor() {
        this.pubSubSubscriptionRoutes = [];
    }

    registerPubSubSubscriptionRoute(pubSubName: string, topicName: string, route: string): void {
        this.pubSubSubscriptionRoutes.push({
            pubsubname: pubSubName, topic: topicName, route
        });
    }
}