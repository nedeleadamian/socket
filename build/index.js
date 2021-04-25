"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moduleAlias = require("module-alias");
moduleAlias.addAliases({
    src: __dirname,
});
const express = require("express");
const http = require("http");
const cluster = require("cluster");
const socket_io_1 = require("socket.io");
const killPort = require("kill-port");
const socket_1 = require("src/common/socket");
const clusters_1 = require("src/clusters");
const port = 3000;
const socketServer = new socket_io_1.Server({ allowEIO3: true });
if (cluster.isMaster) {
    killPort(port).then(clusters_1.spawn);
}
else {
    const app = express();
    const server = http.createServer(app);
    app.use(express.static(__dirname + '/../public'));
    socketServer.attach(server);
    const io = socket_1.initSocket(socketServer);
    server.listen(port, () => {
        console.log(`Listening on port ${port}.`);
    });
}
//# sourceMappingURL=index.js.map