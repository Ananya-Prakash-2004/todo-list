const addTodoBtn = document.getElementById("addTodoBtn");
const inputTag = document.getElementById("todoInput");
const todoListUl = document.getElementById("todoList");
const remaining = document.getElementById("remaining-count");
const filterBtns = document.querySelectorAll(".filter-btn");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");

let todoText;
let todos = [];
let currentFilter = "all";

// Safely load from localStorage
let todosString = localStorage.getItem("todos");
if (todosString) {
    try {
        todos = JSON.parse(todosString).filter(t => t && t.id && t.title);
    } catch (e) {
        todos = [];
        localStorage.removeItem("todos");
    }
}

const getFilteredTodos = () => {
    if (currentFilter === "active") return todos.filter(t => !t.isCompleted);
    if (currentFilter === "completed") return todos.filter(t => t.isCompleted);
    return todos;
};

const updateRemainingCount = () => {
    remaining.innerHTML = todos.filter(t => !t.isCompleted).length;
};

const populateTodos = () => {
    const filteredTodos = getFilteredTodos();
    let string = "";
    for (const todo of filteredTodos) {
        string += `<li id="${todo.id}" class="todo-item ${todo.isCompleted ? "completed" : ""}">
            <input type="checkbox" class="todo-checkbox" ${todo.isCompleted ? "checked" : ""}>
            <span class="todo-text">${todo.title}</span>
            <button class="delete-btn">×</button>
        </li>`;
    }
    todoListUl.innerHTML = string;
    updateRemainingCount();
};

// EVENT DELEGATION — one listener on the <ul> handles all clicks
todoListUl.addEventListener("change", (e) => {
    if (!e.target.classList.contains("todo-checkbox")) return;
    const li = e.target.closest("li");
    if (!li) return;
    const isChecked = e.target.checked;
    todos = todos.map(todo =>
        todo.id === li.id ? { ...todo, isCompleted: isChecked } : todo
    );
    li.classList.toggle("completed", isChecked);
    localStorage.setItem("todos", JSON.stringify(todos));
    updateRemainingCount();
});

todoListUl.addEventListener("click", (e) => {
    if (!e.target.classList.contains("delete-btn")) return;
    const li = e.target.closest("li");
    if (!li) return;
    if (confirm("Do you want to delete this todo?")) {
        todos = todos.filter(todo => todo.id !== li.id);
        localStorage.setItem("todos", JSON.stringify(todos));
        populateTodos();
    }
});

// Filter buttons
filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.dataset.filter;
        populateTodos();
    });
});

// Clear completed
clearCompletedBtn.addEventListener("click", () => {
    todos = todos.filter(t => !t.isCompleted);
    localStorage.setItem("todos", JSON.stringify(todos));
    populateTodos();
});

// Add todo on button click
addTodoBtn.addEventListener("click", () => {
    todoText = inputTag.value;
    if (todoText.trim().length < 4) {
        alert("You cannot add a todo that small!");
        return;
    }
    inputTag.value = "";
    todos.push({ id: "todo-" + Date.now(), title: todoText, isCompleted: false });
    localStorage.setItem("todos", JSON.stringify(todos));
    populateTodos();
});

// Add todo on Enter key
inputTag.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTodoBtn.click();
});

populateTodos();