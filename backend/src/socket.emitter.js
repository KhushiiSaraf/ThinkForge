const { Emitter } = require('@socket.io/redis-emitter');
const IORedis = require('ioredis');

const redisClient = new IORedis(process.env.REDIS_URL);
const emitter = new Emitter(redisClient);

module.exports = emitter;