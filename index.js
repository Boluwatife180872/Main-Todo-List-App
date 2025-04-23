const todoInput = document.getElementById("todo-input");
const addBtn = document.querySelector(".add-btn");
const todoList = document.querySelector(".todo-list");
const filterButtons = document.querySelectorAll(".filters button");
let todos = loadTodos();
let currentFilter = "all";

// Load todos from localStorage
function loadTodos() {
  const storedTodos = localStorage.getItem("todos");
  return storedTodos ? JSON.parse(storedTodos) : [];
}

// Save todos to localStorage
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

addBtn.addEventListener("click", addTodo);
todoInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") addTodo();
});

function addTodo() {
  const todoText = todoInput.value.trim();
  if (todoText === "") return;

  const todo = {
    id: Date.now(),
    text: todoText,
    completed: false,
  };

  todos.push(todo);
  saveTodos();
  renderTodos(currentFilter);
  todoInput.value = "";
}

function renderTodos(filter) {
  currentFilter = filter;
  todoList.innerHTML = "";

  // Update active button
  filterButtons.forEach((button) => {
    button.classList.remove("active");
    if (button.textContent.toLowerCase() === filter) {
      button.classList.add("active");
    }
  });

  // Filter todos
  let filteredTodos = todos;
  if (filter === "completed") {
    filteredTodos = todos.filter((todo) => todo.completed);
  } else if (filter === "pending") {
    filteredTodos = todos.filter((todo) => !todo.completed);
  }

  // Render filtered todos
  filteredTodos.forEach((todo) => {
    const todoItem = document.createElement("li");
    todoItem.classList.add("todo-item");
    if (todo.completed) {
      todoItem.classList.add("completed");
    }

    todoItem.innerHTML = `
        <input type="checkbox" class="checkbox" ${
          todo.completed ? "checked" : ""
        }>
        <span class="todo-text">${todo.text}</span>
        <button class="delete-btn">Delete</button>
    `;

    const checkbox = todoItem.querySelector(".checkbox");
    checkbox.addEventListener("change", function () {
      todo.completed = this.checked;
      saveTodos();
      renderTodos(currentFilter);
    });

    const deleteBtn = todoItem.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", function () {
      todos = todos.filter((t) => t.id !== todo.id);
      saveTodos();
      renderTodos(currentFilter);
    });

    todoList.appendChild(todoItem);
  });
}

// Initial render
renderTodos("all");
