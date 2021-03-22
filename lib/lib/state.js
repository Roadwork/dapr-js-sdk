"use strict";
// https://github.com/dapr/docs/blob/master/reference/api/state_api.md
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
var Response_util_1 = __importDefault(require("../utils/Response.util"));
var DaprState = /** @class */ (function () {
    function DaprState(express, daprUrl) {
        this.daprUrl = daprUrl;
        this.express = express;
    }
    DaprState.prototype.save = function (storeName, stateObjects) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, node_fetch_1.default(this.daprUrl + "/state/" + storeName, {
                            method: 'POST',
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(stateObjects),
                        })];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, Response_util_1.default.handleResponse(res)];
                }
            });
        });
    };
    DaprState.prototype.get = function (storeName, key) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, node_fetch_1.default(this.daprUrl + "/state/" + storeName + "/" + key)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, Response_util_1.default.handleResponse(res)];
                }
            });
        });
    };
    DaprState.prototype.getBulk = function (storeName, keys, parallelism, metadata) {
        if (parallelism === void 0) { parallelism = 10; }
        if (metadata === void 0) { metadata = ""; }
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, node_fetch_1.default(this.daprUrl + "/state/" + storeName + "/bulk" + (metadata ? "?" + metadata : ""), {
                            method: 'POST',
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                keys: keys,
                                parallelism: parallelism // the number of parallel operations executed on the state store for a get operation
                            })
                        })];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, Response_util_1.default.handleResponse(res)];
                }
            });
        });
    };
    DaprState.prototype.delete = function (storeName, key) {
        return __awaiter(this, void 0, void 0, function () {
            var req;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, node_fetch_1.default(this.daprUrl + "/state/" + storeName + "/" + key, {
                            method: 'DELETE',
                        })];
                    case 1:
                        req = _a.sent();
                        return [2 /*return*/, req.status];
                }
            });
        });
    };
    DaprState.prototype.transaction = function (storeName, operations, metadata) {
        if (operations === void 0) { operations = []; }
        if (metadata === void 0) { metadata = null; }
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, node_fetch_1.default(this.daprUrl + "/state/" + storeName + "/transaction", {
                            method: 'POST',
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                operations: operations,
                                metadata: metadata
                            })
                        })];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, Response_util_1.default.handleResponse(res)];
                }
            });
        });
    };
    return DaprState;
}());
exports.default = DaprState;
