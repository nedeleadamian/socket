"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = void 0;
const socketsState = require("src/common/socket/state");
const handlers = require("src/common/socket/handlers");
const pubsub = require("src/common/pubsub");
pubsub.on('outgoing_socket_message', ({ userName, id, args, }) => {
    return socketsState.emit({
        userName,
        id,
        args,
    });
});
const checkToken = (token, id) => ({
    token,
    id,
    firstName: 'Maciej',
    lastName: 'Cieslar',
});
const onAuth = (socket, next) => {
    const { token, id } = socket.handshake.query || socket.request.headers;
    if (!token) {
        return next(new Error('Authorization failed, no token has been provided!'));
    }
    const user = checkToken(token, id);
    socket.user = user;
    return next();
};
const onConnection = (socket, next) => {
    if (!socket.user) {
        return next(new Error('Something went wrong.'));
    }
    const { id } = socket.user;
    socketsState.add(id, socket);
    socket.on('join', (name) => {
        socket.userName = name;
        handlers.sendMessage({ userName: name, id, args: { onlyMessage: true, message: name + ' has joined the chat' } });
        socket.on('disconnect', function () {
            handlers.sendMessage({ userName: name, id, args: { onlyMessage: true, message: name + ' has left the chat' } });
        });
    });
    socket.on('message', (message) => {
        const handler = handlers.sendMessage;
        if (!handler) {
            return null;
        }
        return handler && handler({ userName: socket.userName, id, args: { message } });
    });
    socket.on('disconnect', () => {
        return socketsState.remove(id, socket);
    });
    return next();
};
const initSocket = (instance) => instance.use(onAuth).use(onConnection);
exports.initSocket = initSocket;
//# sourceMappingURL=index.js.map