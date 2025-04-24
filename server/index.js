const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const users = {};
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });
  io.on('connection', (socket) => {
    console.log('a user connected');
  
    socket.on('login', (username) => {
      users[socket.id] = username; 
      console.log(`${username} logged in`);
      io.emit('user_joined', { username, timestamp: new Date().toLocaleTimeString() });
    });
    socket.on('send_message',(data)=>{
      const username = users[socket.id] || "Anonymous";
      const messageData = {
        text: data.text,
        sender: username,
        timestamp: new Date().toLocaleTimeString(),
      };
      console.log("Message received:", messageData);
      io.emit('received_message',messageData)
    })
  
    socket.on('disconnect', () => {
      const username = users[socket.id];
      io.emit('user_left', { username, timestamp: new Date().toLocaleTimeString() });
      delete users[socket.id]; 
    });
    
  });

server.listen(3000, () => {
    console.log('listening on *:3000');
});