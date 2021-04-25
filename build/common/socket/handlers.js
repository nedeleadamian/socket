"use strict";
const pubsub = require("src/common/pubsub");
const dispatch = ({ userName, id, args, }) => {
    console.log('emit', process.pid);
    pubsub.emit('outgoing_socket_message', { userName, id, args });
};
const dispatchTypes = {
    MESSAGE_SENT: 'message_sent',
    POST_UPDATED_NOTIFICATION: 'post_updated_notification',
};
const handlers = {
    sendMessage: async ({ userName, id, args }) => {
        dispatch({ userName, id, args });
    },
    postUpdated: async ({ userName, id, args }) => {
        dispatch({ userName, id, args });
    },
};
module.exports = handlers;
//# sourceMappingURL=handlers.js.map