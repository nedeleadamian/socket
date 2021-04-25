"use strict";
const NRP = require("node-redis-pubsub");
const client = new NRP({
    port: 6379,
    scope: 'message',
});
module.exports = client;
//# sourceMappingURL=index.js.map