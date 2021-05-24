import DaprClientBinding from './lib/GRPCClient/binding';
import DaprClientPubSub from './lib/GRPCClient/pubsub';
import DaprClientState from './lib/GRPCClient/state';
import DaprClientInvoker from './lib/GRPCClient/invoker';
import DaprClientSecret from './lib/GRPCClient/secret';
import DaprClientActor from './lib/GRPCClient/actor';
import GRPCClient from './lib/GRPCClient/GRPCClient';

export default class DaprClient {
  daprHost: string;
  daprPort: string;
  daprClient: GRPCClient;
  pubsub: DaprClientPubSub;
  state: DaprClientState;
  binding: DaprClientBinding;
  invoker: DaprClientInvoker;
  secret: DaprClientSecret;
  actor: DaprClientActor;

  constructor(daprHost: string, daprPort: string) {
    this.daprHost = daprHost || '127.0.0.1';
    this.daprPort = daprPort || "5005";

    this.daprClient = new GRPCClient(daprHost, daprPort);

    this.state = new DaprClientState(this.daprClient);
    this.pubsub = new DaprClientPubSub(this.daprClient);
    this.binding = new DaprClientBinding(this.daprClient);
    this.invoker = new DaprClientInvoker(this.daprClient);
    this.secret = new DaprClientSecret(this.daprClient);
    this.actor = new DaprClientActor(this.daprClient);
  }
}