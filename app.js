const express = require('express');
const app     = express();
const server  = require('http').createServer(app);
const io      = require('socket.io')(server);

//Add recent chats to messages array
const messages  = [];
const prevChats = 10;
const storeMessage = function(name, data){
  messages.push({name: name, data: data});
  if (messages.length > prevChats) {
    messages.shift();
  }
};

//Setup the app with Express
app.use(express.static(__dirname + '/public'));

//Socket.io
io.on('connection', (socket) => {

  //Log activity
  socket.on('join', (name) =>{
    socket.userName = name;
    socket.broadcast.emit('chat', name + ' has joined the chat');
    console.log(name + ' has joined the chat');

    //Log who has left
    socket.on('disconnect', function(){
      socket.broadcast.emit('chat', name + ' has left the chat');
      console.log(name + ' has left the chat');
    });
  });

  //Log chats
  socket.on('chat', (message) => {
    io.emit('chat', socket.userName + ': ' + message);
    storeMessage(socket.userName, message);
    console.log(socket.userName + ': ' + message);
  });

  //Log previous chats for new users
  messages.forEach((message) => {
    socket.emit('chat', message.name + ': ' + message.data);
  });
});

//Listen at localhost:3000
server.listen(3000, () => {
  console.log('listening on *:3000');
});
