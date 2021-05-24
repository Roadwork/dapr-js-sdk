import DaprClientBinding from './lib/WebClient/binding';
import DaprClientPubSub from './lib/WebClient/pubsub';
import DaprClientState from './lib/WebClient/state';
import DaprClientInvoker from './lib/WebClient/invoker';
import DaprClientSecret from './lib/WebClient/secret';
import DaprClientActor from './lib/WebClient/actor';
import WebClient from './lib/WebClient/WebClient';

export default class DaprClient {
  daprHost: string;
  daprPort: string;
  daprClient: WebClient;
  pubsub: DaprClientPubSub;
  state: DaprClientState;
  binding: DaprClientBinding;
  invoker: DaprClientInvoker;
  secret: DaprClientSecret;
  actor: DaprClientActor;

  constructor(daprHost: string, daprPort: string) {
    this.daprHost = daprHost || '127.0.0.1';
    this.daprPort = daprPort || "5005";

    this.daprClient = new WebClient(daprHost, daprPort);

    this.state = new DaprClientState(this.daprClient);
    this.pubsub = new DaprClientPubSub(this.daprClient);
    this.binding = new DaprClientBinding(this.daprClient);
    this.invoker = new DaprClientInvoker(this.daprClient);
    this.secret = new DaprClientSecret(this.daprClient);
    this.actor = new DaprClientActor(this.daprClient);
  }
}