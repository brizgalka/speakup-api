"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisServer = void 0;
const redis_1 = require("redis");
class RedisServer {
    connection;
    urlConnection;
    constructor(options) {
        this.urlConnection = options.urlConnection;
        this.connection = (0, redis_1.createClient)({
            url: options.urlConnection
        });
        if (this.connection != undefined) {
            console.log("REDIS CONNECTED");
        }
        this.connection.connect();
        this.connection.on('error', (err) => console.log('Redis Client Error', err));
    }
    async set(key, value) {
        await this.connection.set(key, value);
    }
    async get(key) {
        return await this.connection.get(key);
    }
    async del(key) {
        await this.connection.del(key);
    }
    async disconnect() {
        await this.connection.disconnect();
    }
}
exports.RedisServer = RedisServer;
//# sourceMappingURL=RedisServer.js.map