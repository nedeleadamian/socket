import {Socket, Namespace} from 'socket.io';
import * as socketsState from 'src/common/socket/state';
import * as handlers from 'src/common/socket/handlers';
import * as pubsub from 'src/common/pubsub';

pubsub.on('outgoing_socket_message', ({
                                        userName,
                                        id,
                                        args,
                                      }) => {
     return socketsState.emit({
       userName,
       id,
       args,
     })
    }
);

interface User {
  id: string;
  firstName: string;
  lastName: string;
}

interface AuthorizedSocket extends Socket {
  user: User;
}

const checkToken = (token: string, id: string) => ({
  token,
  id,
  firstName: 'Maciej',
  lastName: 'Cieslar',
});

type SocketMiddleware = (
  socket: AuthorizedSocket,
  next: (err?: Error) => void,
) => any;

const onAuth: SocketMiddleware = (socket, next) => {
  const { token, id }: { token: string; id: string } =
    socket.handshake.query as any || socket.request.headers;

  if (!token) {
    return next(new Error('Authorization failed, no token has been provided!'));
  }

  // mock
  const user = checkToken(token, id);

  socket.user = user;

  return next();
};

const onConnection: SocketMiddleware = (socket, next) => {
  if (!socket.user) {
    return next(new Error('Something went wrong.'));
  }

  const { id } = socket.user;

  socketsState.add(id, socket);

  socket.on('join', (name) =>{
    //@ts-ignore
    socket.userName = name;
    //@ts-ignore
    handlers.sendMessage({userName: name, id, args: {onlyMessage: true, message: name + ' has joined the chat'}});

    //Log who has left
    socket.on('disconnect', function(){
      //@ts-ignore
      handlers.sendMessage({userName: name, id, args: {onlyMessage: true, message: name + ' has left the chat'}});
    });
  });

  socket.on('message', (message) => {
    const handler = handlers.sendMessage;
    if (!handler) {
      return null;
    }

    // @ts-ignore
    return handler && handler({userName: socket.userName, id, args: {message} });
  });

  socket.on('disconnect', () => {
    return socketsState.remove(id, socket);
  });

  return next();
};

const initSocket = (instance: any): Namespace =>
  instance.use(onAuth).use(onConnection);

export { initSocket };
