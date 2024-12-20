"use strict";
const tasks = loadTasks();
let taskId = tasks.length ? Math.max(...tasks.map(task => task.id)) + 1 : 0;
const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');
addTaskButton.addEventListener('click', () => {
    if (taskInput.value.trim() === '')
        return;
    const newTask = {
        id: taskId++,
        name: taskInput.value.trim(),
        done: false,
    };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskInput.value = '';
});
function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const listItem = document.createElement('li');
        listItem.textContent = task.name;
        // Обработчик для отметки задачи как выполненной
        listItem.addEventListener('click', () => {
            task.done = !task.done;
            saveTasks();
            renderTasks();
        });
        // Зачеркивание для выполненных задач
        if (task.done) {
            listItem.style.textDecoration = 'line-through';
        }
        // Кнопка для удаления задачи
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Удалить';
        deleteButton.addEventListener('click', (event) => {
            event.stopPropagation();
            tasks.splice(tasks.indexOf(task), 1);
            saveTasks();
            renderTasks();
        });
        listItem.appendChild(deleteButton);
        taskList.appendChild(listItem);
    });
}
// Функция для сохранения задач в localStorage
function saveTasks() {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 3); // Устанавливаем срок хранения на 3 дня
    localStorage.setItem('tasks', JSON.stringify({ tasks, expiration: expirationDate.toISOString() }));
}
// Функция для загрузки задач из localStorage
function loadTasks() {
    const storedData = localStorage.getItem('tasks');
    if (storedData) {
        const { tasks, expiration } = JSON.parse(storedData);
        const expirationDate = new Date(expiration);
        if (new Date() < expirationDate) {
            return tasks;
        }
        else {
            localStorage.removeItem('tasks');
        }
    }
    return [];
}
renderTasks();
