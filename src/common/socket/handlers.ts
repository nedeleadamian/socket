import * as pubsub from 'src/common/pubsub';

const dispatch = ({
  userName,
  id,
  args,
}: {
  userName: string;
  id: string;
  args: any;
}) => {
  console.log('emit', process.pid);
  pubsub.emit('outgoing_socket_message', { userName, id, args });
}

const dispatchTypes = {
  MESSAGE_SENT: 'message_sent',
  POST_UPDATED_NOTIFICATION: 'post_updated_notification',
};

interface Handlers {
  [key: string]: ({ userName, id, args }: { userName: string, id: string; args: any }) => any;
}

const handlers: Handlers = {
  sendMessage: async ({ userName, id, args }) => {
    // await sendMessageToUser();

    dispatch({ userName, id, args });
  },
  postUpdated: async ({ userName, id, args }) => {
    dispatch({ userName, id, args });
  },
};

export = handlers;
