import {createClient, RedisClientType } from "redis";

interface RedisServerInterface {
    urlConnection: string,
    connection: RedisClientType
}

interface RedisOptionsInterface {
    urlConnection: string,
}

class RedisServer implements RedisServerInterface{

    readonly connection: RedisClientType;
    readonly urlConnection: string;

    constructor(options: RedisOptionsInterface) {
        this.urlConnection = options.urlConnection
        this.connection = createClient({
            url: options.urlConnection
        });
        if(this.connection) {
            console.log("REDIS CONNECTED")
        }
        this.connection.on('error', (err: string) => console.log('Redis Client Error', err));
    }

    async set(key: string,value: string) {
        await this.connection.set(key, value);
    }

    async get(key: string) {
        return await this.connection.get(key)
    }

    async disconnect() {
        await this.connection.disconnect();
    }

}

export {
    RedisServer,
}