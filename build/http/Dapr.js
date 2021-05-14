"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var binding_1 = __importDefault(require("./lib/binding"));
var pubsub_1 = __importDefault(require("./lib/pubsub"));
var state_1 = __importDefault(require("./lib/state"));
var invoker_1 = __importDefault(require("./lib/invoker"));
var secret_1 = __importDefault(require("./lib/secret"));
var actor_1 = __importDefault(require("./lib/actor"));
var Dapr = /** @class */ (function () {
    function Dapr(daprUrl, daprPort, daprInternalServerPort) {
        this.url = daprUrl || '127.0.0.1';
        this.daprPort = daprPort || 3500;
        if (!this.url.startsWith('http://') && !this.url.startsWith('https://')) {
            this.url = "http://" + this.url;
        }
        // Set the internal server port and make it available under env variable DAPR_INTERNAL_SERVER_PORT
        // This will be fetched by the WebServerSingleton
        // We do this to avoid requiring an initialization method on this constructor due to async/await
        this.daprInternalServerPort = daprInternalServerPort || parseInt(process.env.DAPR_INTERNAL_SERVER_PORT || "", 10) || 0;
        process.env.DAPR_INTERNAL_SERVER_PORT = "" + this.daprInternalServerPort;
        this.urlDapr = this.url + ":" + this.daprPort + "/v1.0";
        this.pubsub = new pubsub_1.default(this.urlDapr);
        this.state = new state_1.default(this.urlDapr);
        this.binding = new binding_1.default(this.urlDapr);
        this.invoker = new invoker_1.default(this.urlDapr);
        this.secret = new secret_1.default(this.urlDapr);
        this.actor = new actor_1.default(this.urlDapr);
    }
    return Dapr;
}());
exports.default = Dapr;
