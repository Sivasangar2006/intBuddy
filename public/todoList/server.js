const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

// Set up server
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Store the to-do list
let todoList = [];

// Serve the static HTML file
app.use(express.static(__dirname));

// Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log('A user connected');

    // Send the current to-do list to the newly connected user
    socket.emit('todoList', todoList);

    // When a user adds a new item
    socket.on('addTodo', (newTodo) => {
        todoList.push(newTodo);
        io.emit('todoList', todoList);  // Broadcast the updated list to everyone
    });

    // When a user edits an item
    socket.on('editTodo', (editedTodo) => {
        const index = todoList.findIndex(todo => todo.id === editedTodo.id);
        if (index !== -1) {
            todoList[index] = editedTodo;
            io.emit('todoList', todoList);
        }
    });

    // When a user deletes an item
    socket.on('deleteTodo', (todoId) => {
        todoList = todoList.filter(todo => todo.id !== todoId);
        io.emit('todoList', todoList);
    });

    // When a user disconnects
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
