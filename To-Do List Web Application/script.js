// Elements
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const darkModeBtn = document.getElementById("darkModeBtn");

// Load stored tasks on startup
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Save tasks to Local Storage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render tasks list
function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.classList.add("task");
        if (task.completed) li.classList.add("completed");
        li.draggable = true;

        li.innerHTML = `
            <span contenteditable="false">${task.text}</span>
            <button class="btn complete">✓</button>
            <button class="btn edit">Edit</button>
            <button class="btn delete">Delete</button>
        `;

        li.querySelector(".complete").addEventListener("click", () => {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        });

        li.querySelector(".edit").addEventListener("click", (e) => {
            const span = li.querySelector("span");

            if (span.contentEditable === "false") {
                span.contentEditable = "true";
                span.focus();
                e.target.textContent = "Save";
            } else {
                span.contentEditable = "false";
                task.text = span.textContent;
                e.target.textContent = "Edit";
                saveTasks();
            }
        });

        li.querySelector(".delete").addEventListener("click", () => {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        });

        li.addEventListener("dragstart", () => {
            li.classList.add("dragging");
        });

        li.addEventListener("dragend", () => {
            li.classList.remove("dragging");
            reorderTasks();
        });

        taskList.appendChild(li);
    });
}

// Add task
addBtn.addEventListener("click", () => {
    if (taskInput.value.trim() === "") return;
    
    tasks.push({ text: taskInput.value, completed: false });
    saveTasks();
    renderTasks();
    taskInput.value = "";
});

// Reorder tasks after drag-drop
function reorderTasks() {
    const newOrder = [...taskList.children].map(li => li.querySelector("span").textContent);

    tasks = newOrder.map(text => ({
        text,
        completed: tasks.find(t => t.text === text)?.completed || false
    }));

    saveTasks();
}

// Dark Mode
darkModeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

// Initial render
renderTasks();
