"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emit = exports.remove = exports.add = void 0;
const socketsState = {};
const add = (id, socket) => {
    if (!socketsState[id]) {
        socketsState[id] = [];
    }
    socketsState[id] = [...socketsState[id], socket];
    return socketsState[id];
};
exports.add = add;
const remove = (id, socket) => {
    if (!socketsState[id]) {
        return null;
    }
    socketsState[id] = socketsState[id].filter((s) => s !== socket);
    if (!socketsState[id].length) {
        socketsState[id] = undefined;
    }
    return null;
};
exports.remove = remove;
const emit = ({ userName, id, args, }) => {
    if (!socketsState[id]) {
        return null;
    }
    socketsState[id].forEach((socket) => socket.emit('message', { userName, id, args }));
    return null;
};
exports.emit = emit;
//# sourceMappingURL=state.js.map