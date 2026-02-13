// Select DOM elements
const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const clearAllButton = document.getElementById('clearAllButton');
const taskList = document.getElementById('taskList');
const totalTasksSpan = document.getElementById('totalTasks');
const completedTasksSpan = document.getElementById('completedTasks');

// Array to store tasks
let tasks = [];

// Load tasks from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    loadTasksFromStorage();
    renderTasks();
});

// Add task event listener
addButton.addEventListener('click', addTask);

// Clear all tasks event listener
clearAllButton.addEventListener('click', clearAllTasks);

// Allow Enter key to add task
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Function to add a new task
function addTask() {
    const taskText = taskInput.value.trim();
    
    // Validate input
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }
    
    // Create task object
    const task = {
        id: Date.now(), // Unique ID using timestamp
        text: taskText,
        completed: false
    };
    
    // Add to tasks array
    tasks.push(task);
    
    // Clear input field
    taskInput.value = '';
    
    // Save to localStorage
    saveTasksToStorage();
    
    // Re-render the task list
    renderTasks();
}

// Function to render all tasks
function renderTasks() {
    // Clear the current list
    taskList.innerHTML = '';
    
    // If no tasks, show empty state
    if (tasks.length === 0) {
        taskList.innerHTML = '<div class="empty-state">No tasks yet. Add one to get started!</div>';
    }
    
    // Loop through tasks and create list items
    tasks.forEach(task => {
        const taskItem = createTaskElement(task);
        taskList.appendChild(taskItem);
    });
    
    // Update statistics
    updateStats();
}

// Function to create a task element
function createTaskElement(task) {
    // Create list item
    const li = document.createElement('li');
    li.className = 'task-item';
    li.dataset.id = task.id;
    
    // Add completed class if task is completed
    if (task.completed) {
        li.classList.add('completed');
    }
    
    // Create task content div
    const taskContent = document.createElement('div');
    taskContent.className = 'task-content';
    
    // Create checkbox
    const checkbox = document.createElement('div');
    checkbox.className = 'task-checkbox';
    
    // Create task text
    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = task.text;
    
    // Append checkbox and text to content
    taskContent.appendChild(checkbox);
    taskContent.appendChild(taskText);
    
    // Add click event to toggle completion
    taskContent.addEventListener('click', () => toggleTaskCompletion(task.id));
    
    // Create remove button
    const removeButton = document.createElement('button');
    removeButton.className = 'remove-button';
    removeButton.textContent = 'Delete';
    
    // Add click event to remove task
    removeButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering the toggle event
        removeTask(task.id);
    });
    
    // Append content and button to list item
    li.appendChild(taskContent);
    li.appendChild(removeButton);
    
    return li;
}

// Function to toggle task completion
function toggleTaskCompletion(taskId) {
    // Find the task and toggle its completed status
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveTasksToStorage();
        renderTasks();
    }
}

// Function to remove a task
function removeTask(taskId) {
    // Filter out the task with the given ID
    tasks = tasks.filter(t => t.id !== taskId);
    saveTasksToStorage();
    renderTasks();
}

// Function to update statistics
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    
    totalTasksSpan.textContent = total;
    completedTasksSpan.textContent = completed;
}

// Function to save tasks to localStorage
function saveTasksToStorage() {
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
}

// Function to clear all tasks
function clearAllTasks() {
    if (tasks.length === 0) {
        alert('No tasks to clear!');
        return;
    }
    
    // Confirm before clearing
    const confirmed = confirm('Are you sure you want to delete all tasks?');
    if (confirmed) {
        tasks = [];
        saveTasksToStorage();
        renderTasks();
    }
}

// Function to load tasks from localStorage
function loadTasksFromStorage() {
    const storedTasks = localStorage.getItem('todoTasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
}

// Event delegation example (alternative approach for handling dynamic elements)
// This demonstrates event delegation by attaching one listener to the parent
taskList.addEventListener('click', (e) => {
    // This is an example of event delegation
    // We're listening on the parent (taskList) instead of individual task items
    // The actual event handling is done in the createTaskElement function above
});
