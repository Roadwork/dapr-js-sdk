"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_fetch_1 = __importDefault(require("node-fetch"));
var HttpStatusCode_enum_1 = __importDefault(require("../enum/HttpStatusCode.enum"));
var WebServerSingleton_1 = __importDefault(require("./WebServer/WebServerSingleton"));
var Response_util_1 = __importDefault(require("../utils/Response.util"));
var DaprBinding = /** @class */ (function () {
    function DaprBinding(daprUrl) {
        this.daprUrl = daprUrl;
    }
    // Receive an input from an external system
    DaprBinding.prototype.receive = function (bindingName, cb) {
        return __awaiter(this, void 0, void 0, function () {
            var server;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, WebServerSingleton_1.default.getServer()];
                    case 1:
                        server = _a.sent();
                        console.log("[Binding] Listening on /" + bindingName);
                        server.post("/" + bindingName, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                            var e_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        req.setTimeout(60 * 1000); // amount of seconds to wait for the request CB to finalize
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, cb(req === null || req === void 0 ? void 0 : req.body)];
                                    case 2:
                                        _a.sent();
                                        // we send the processing status after we are done processing
                                        // note: if the callback takes longer than the expected wait time in the queue, it might be that this never gets called
                                        // @todo: can we do this cleaner without sending the response directly?
                                        res.statusCode = HttpStatusCode_enum_1.default.OK;
                                        return [2 /*return*/, res.end()];
                                    case 3:
                                        e_1 = _a.sent();
                                        res.statusCode = HttpStatusCode_enum_1.default.INTERNAL_SERVER_ERROR;
                                        return [2 /*return*/, res.end(JSON.stringify({
                                                error: "COULD_NOT_PROCESS_CALLBACK",
                                                error_msg: "Something happened while processing the input binding callback - " + e_1.message
                                            }))];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); });
                        return [2 /*return*/];
                }
            });
        });
    };
    // Send an event to an external system
    DaprBinding.prototype.send = function (bindingName, data, metadata) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, node_fetch_1.default(this.daprUrl + "/bindings/" + bindingName, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                operation: 'create',
                                data: data,
                                metadata: metadata
                            }),
                        })];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, Response_util_1.default.handleResponse(res)];
                }
            });
        });
    };
    return DaprBinding;
}());
exports.default = DaprBinding;
