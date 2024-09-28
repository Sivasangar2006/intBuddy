const socket = io();

// Elements
const todoListElement = document.getElementById('todo-list');
const todoInput = document.getElementById('todo-input');
const addTodoButton = document.getElementById('add-todo');

// Add a new task
addTodoButton.addEventListener('click', () => {
    const newTodo = {
        id: Date.now(),
        text: todoInput.value
    };
    socket.emit('addTodo', newTodo);
    todoInput.value = '';
});

// Listen for the updated to-do list from the server
socket.on('todoList', (todoList) => {
    todoListElement.innerHTML = '';
    todoList.forEach(todo => {
        const li = document.createElement('li');
        li.textContent = todo.text;
        li.contentEditable = true;

        // Create delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-btn');
        deleteButton.onclick = () => {
            socket.emit('deleteTodo', todo.id);
        };

        li.onblur = () => {
            todo.text = li.textContent;
            socket.emit('editTodo', todo);
        };
        li.appendChild(deleteButton);
        todoListElement.appendChild(li);
    });
});
