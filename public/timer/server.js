const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files
app.use(express.static(__dirname));

// Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for timer updates from clients
    socket.on('timerUpdate', (time) => {
        socket.broadcast.emit('timerUpdate', time); // Broadcast the timer update to other clients
    });

    // Listen for timer expiration from clients
    socket.on('timerExpired', () => {
        socket.broadcast.emit('timerExpired'); // Broadcast timer expiration to other clients
    });

    // Listen for timer reset from clients
    socket.on('timerReset', () => {
        socket.broadcast.emit('timerReset'); // Broadcast timer reset to other clients
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
