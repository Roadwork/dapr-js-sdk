"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebServerSingleton = exports.WebServer = void 0;
var WebServer_1 = __importDefault(require("./WebServer"));
exports.WebServer = WebServer_1.default;
var WebServerSingleton_1 = __importDefault(require("./WebServerSingleton"));
exports.WebServerSingleton = WebServerSingleton_1.default;
