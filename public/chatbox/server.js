const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('pub'));

// Listen for new socket connections
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle when a user joins a room with a username
    socket.on('joinRoom', (username) => {
        socket.username = username;
        socket.broadcast.emit('message', `${username} has joined the chat`);
        socket.emit('message', `Welcome to the chat, ${username}!`);
    });

    // Handle incoming messages
    socket.on('chatMessage', (msg) => {
        io.emit('message', `${socket.username}: ${msg}`);
    });

    // Handle user disconnecting
    socket.on('disconnect', () => {
        if (socket.username) {
            io.emit('message', `${socket.username} has left the chat`);
        }
    });
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
