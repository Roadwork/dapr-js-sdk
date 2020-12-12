"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var binding_1 = __importDefault(require("./lib/binding"));
var pubsub_1 = __importDefault(require("./lib/pubsub"));
var state_1 = __importDefault(require("./lib/state"));
var invoke_1 = __importDefault(require("./lib/invoke"));
var Dapr = /** @class */ (function () {
    function Dapr(daprUrl, daprPort) {
        this.url = daprUrl || "127.0.0.1";
        this.port = daprPort || 3500;
        if (!this.url.startsWith('http://') && !this.url.startsWith('https://')) {
            this.url = "http://" + this.url;
        }
        this.urlDapr = this.url + ":" + this.port + "/v1.0";
        this.express = express_1.default();
        this.pubsub = new pubsub_1.default(this.express, daprUrl, daprPort);
        this.state = new state_1.default(this.express, daprUrl, daprPort);
        this.binding = new binding_1.default(this.express, daprUrl, daprPort);
        this.invoke = new invoke_1.default(this.express, daprUrl, daprPort);
    }
    return Dapr;
}());
exports.default = Dapr;
