import * as moduleAlias from 'module-alias';

moduleAlias.addAliases({
  src: __dirname,
});

import * as express from 'express';
import * as http from 'http';
import * as cluster from 'cluster';
import {
Server
} from 'socket.io';
import * as killPort from 'kill-port';
import { initSocket } from 'src/common/socket';
import { spawn } from 'src/clusters';

const port = 3000;
const socketServer = new Server({allowEIO3: true});


if (cluster.isMaster) {
  killPort(port).then(spawn);
} else {
  const app = express();
  const server = http.createServer(app);
  app.use(express.static(__dirname + '/../public'));
  socketServer.attach(server);
  const io = initSocket(socketServer);

  server.listen(port, () => {
    console.log(`Listening on port ${port}.`);
  });
}
