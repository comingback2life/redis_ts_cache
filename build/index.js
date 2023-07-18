'use strict';
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
import express from 'express';
import fetch from 'node-fetch';
import redis from 'redis';
var PORT = parseInt(process.env.NODE_ENV === 'production'
    ? process.env.PORT
    : '8000', 10);
var client = redis.createClient();
client.connect();
var app = express();
var setResponse = function (username, repos) {
    return "<h2>".concat(username, " has ").concat(repos, " repositories on Github.");
};
/**
 * This is going to make request to GITHUB for a user specific data.
 */
var getNumberOfRepos = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, response, data, repos, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                username = req.params.username;
                return [4 /*yield*/, fetch("https://api.github.com/users/".concat(username))];
            case 1:
                response = _a.sent();
                return [4 /*yield*/, response.json()];
            case 2:
                data = (_a.sent());
                repos = data.public_repos.toString();
                //set Data with expiration to redis
                /**
                 * @description Params description for the client.setEx method
                 * @param {string} username - The github user username, also the key for the cache.
                 * @param {number} seconds - The cache TTL
                 * @param {string} repos -  The number of github repositories for the user and the value for the above key
                 */
                client.setEx(username, 3600, repos);
                res.send(setResponse(username, repos));
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.log(error_1);
                res.status(500);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
/**
 * Middleware function for caching
 */
var redisCache = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var username, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                username = req.params.username;
                return [4 /*yield*/, client.get(username).catch(function (err) {
                        throw err;
                    })];
            case 1:
                data = _a.sent();
                if (data !== null) {
                    res.send(setResponse(username, data));
                }
                else {
                    next();
                }
                return [2 /*return*/];
        }
    });
}); };
app.get('/repos/:username', redisCache, getNumberOfRepos); // add redisCache as a middleware function
app.listen(PORT, function () {
    console.log('Server is alive on PORT', PORT);
});
