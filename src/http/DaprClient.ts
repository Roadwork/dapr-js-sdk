import GRPCClientBindingStrategy from '../strategies/GRPCClient/binding';
import GRPCClientPubSubStrategy from '../strategies/GRPCClient/pubsub';
import GRPCClientStateStrategy from '../strategies/GRPCClient/state';
import GRPCClientInvokerStrategy from '../strategies/GRPCClient/invoker';
import GRPCClientSecretStrategy from '../strategies/GRPCClient/secret';
import GRPCClientActorStrategy from '../strategies/GRPCClient/actor';

import IBindingStrategy from '../strategies/IClientBindingStrategy';
import IPubSubStrategy from '../strategies/IClientPubSubStrategy';
import IStateStrategy from '../strategies/IClientStateStrategy';
import IInvokerStrategy from '../strategies/IClientInvokerStrategy';
import ISecretStrategy from '../strategies/IClientSecretStrategy';
import IActorStrategy from '../strategies/IClientActorStrategy';

import GRPCClientStrategy from '../strategies/GRPCClient/GRPCClient';

export default class DaprClient {
  daprHost: string;
  daprPort: string;

  daprClient: GRPCClientStrategy;

  pubsub: IPubSubStrategy;
  state: IStateStrategy;
  binding: IBindingStrategy;
  invoker: IInvokerStrategy;
  secret: ISecretStrategy;
  actor: IActorStrategy;

  constructor(daprHost: string, daprPort: string) {
    this.daprHost = daprHost || '127.0.0.1';
    this.daprPort = daprPort || "5005";

    this.daprClient = new GRPCClientStrategy(daprHost, daprPort);

    this.state = new GRPCClientStateStrategy(this.daprClient);
    this.pubsub = new GRPCClientPubSubStrategy(this.daprClient);
    this.binding = new GRPCClientBindingStrategy(this.daprClient);
    this.invoker = new GRPCClientInvokerStrategy(this.daprClient);
    this.secret = new GRPCClientSecretStrategy(this.daprClient);
    this.actor = new GRPCClientActorStrategy(this.daprClient);
  }
}