const express = require('express');
const app = express();
const http = require('http').createServer(app);

//storing socket.io in io
const io = require('socket.io')(http);

app.use(express.static('public'));

//.on function is basically just listening for any events
//.emit when used on client side will send an event from the client to the server
//.emit when used on the server side will send the event to all the sockets that are connected to it

//so the way it works is basically the client will .emit an event, and the server will recieve it using .on function, and the server then will use .emit to emit the events to all the sockets connected to it

//each time there is a connection, it will print the socket id of the user which connected
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('mouse', (data) => {
        //what broadcast does is that when the server emits an event it make sures  it doesnt send the event back to the client who sent it to the server
        //because if the server just used normal emit, the client who sent the event will also recieve the event once again
        socket.broadcast.emit('mouse', data);
    });

    socket.on('reset', () => {
        io.emit('reset');
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

http.listen(3000, () => {
    console.log('Server is running on port 3000');
});
