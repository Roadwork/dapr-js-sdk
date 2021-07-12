import HTTPClientBindingStrategy from '../strategies/HTTPClient/binding';
import HTTPClientPubSubStrategy from '../strategies/HTTPClient/pubsub';
import HTTPClientStateStrategy from '../strategies/HTTPClient/state';
import HTTPClientInvokerStrategy from '../strategies/HTTPClient/invoker';
import HTTPClientSecretStrategy from '../strategies/HTTPClient/secret';
import HTTPClientActorStrategy from '../strategies/HTTPClient/actor';

import IBindingStrategy from '../strategies/IClientBindingStrategy';
import IPubSubStrategy from '../strategies/IClientPubSubStrategy';
import IStateStrategy from '../strategies/IClientStateStrategy';
import IInvokerStrategy from '../strategies/IClientInvokerStrategy';
import ISecretStrategy from '../strategies/IClientSecretStrategy';
import IActorStrategy from '../strategies/IClientActorStrategy';

import HTTPClientStrategy from '../strategies/HTTPClient/GRPCClient';

export default class DaprClient {
  daprHost: string;
  daprPort: string;

  daprClient: HTTPClientStrategy;

  pubsub: IPubSubStrategy;
  state: IStateStrategy;
  binding: IBindingStrategy;
  invoker: IInvokerStrategy;
  secret: ISecretStrategy;
  actor: IActorStrategy;

  constructor(daprHost: string, daprPort: string) {
    this.daprHost = daprHost || '127.0.0.1';
    this.daprPort = daprPort || "5005";

    this.daprClient = new HTTPClientStrategy(daprHost, daprPort);

    this.state = new HTTPClientStateStrategy(this.daprClient);
    this.pubsub = new HTTPClientPubSubStrategy(this.daprClient);
    this.binding = new HTTPClientBindingStrategy(this.daprClient);
    this.invoker = new HTTPClientInvokerStrategy(this.daprClient);
    this.secret = new HTTPClientSecretStrategy(this.daprClient);
    this.actor = new HTTPClientActorStrategy(this.daprClient);
  }
}