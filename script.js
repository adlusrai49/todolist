document.addEventListener("DOMContentLoaded", () => {
    const todoListsContainer = document.getElementById("todoLists");
    const taskForm = document.getElementById("toDoForm");
    const listNameInput = document.getElementById("listNameInput");
    const taskInput = document.getElementById("taskInput");
    const clearBtn = document.getElementById("clearBtn");

    let todoLists = JSON.parse(localStorage.getItem("todoLists")) || [];

    loadTodoLists();

    taskForm.addEventListener("submit", (e) => {
        e.preventDefault();
        addTaskToList();
    });

    clearBtn.addEventListener("click", () => {
        localStorage.removeItem("todoLists");
        todoLists = [];
        loadTodoLists();
    });

    function addTaskToList() {
        const listName = listNameInput.value.trim();
        const taskContent = taskInput.value.trim();
        if (listName !== "" && taskContent !== "") {
            let currentList = todoLists.find((list) => list.name === listName);
            if (!currentList) {
                currentList = { name: listName, tasks: [] };
                todoLists.push(currentList);
            }

            const task = {
                id: Date.now(),
                content: taskContent,
                completed: false
            };

            currentList.tasks.push(task);
            saveTodoLists();
            loadTodoLists();
            taskInput.value = "";
        }
    }

    function loadTodoLists() {
        todoListsContainer.innerHTML = "";
        todoLists.forEach((list) => {
            const listDiv = document.createElement("div");
            listDiv.className = "card mb-4";
            listDiv.innerHTML = `
                <div class="card-body bg-yellow">
                    <h2 class="card-title">${list.name}</h2>
                    <button class="deleteListBtn btn btn-danger" data-list-name="${list.name}">Delete List</button>
                    <form>
                        <div class="form-group">
                            <input type="text" class="taskInput form-control" data-list-name="${list.name}" placeholder="Add new task">
                        </div>
                        <button type="submit" class="btn btn-primary">Add Task</button>
                    </form>
                    <ul class="taskList list-group mt-3" data-list-name="${list.name}"></ul>
                </div>
            `;
            const form = listDiv.querySelector("form");
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                addTaskToListByName(list.name);
            });

            const deleteListBtn = listDiv.querySelector(".deleteListBtn");
            deleteListBtn.addEventListener("click", () => deleteList(list.name));

            todoListsContainer.appendChild(listDiv);

            const taskList = listDiv.querySelector(".taskList");
            list.tasks.forEach((task) => {
                const li = document.createElement("li");
                li.className = `list-group-item ${task.completed ? 'completed' : ''} bg-yellow`;
                li.innerHTML = `
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="${task.id}" data-list-name="${list.name}" ${task.completed ? "checked" : ""}>
                        <label class="form-check-label ${task.completed ? 'completed' : ''}" for="${task.id}">${task.content}</label>
                    </div>
                `;
                li.querySelector("input[type='checkbox']").addEventListener("change", () => toggleTask(task.id, list.name));
                taskList.appendChild(li);
            });
        });
    }

    function addTaskToListByName(listName) {
        const taskContent = document.querySelector(`.taskInput[data-list-name="${listName}"]`).value.trim();
        if (taskContent !== "") {
            const currentList = todoLists.find((list) => list.name === listName);
            const task = {
                id: Date.now(),
                content: taskContent,
                completed: false
            };
            currentList.tasks.push(task);
            saveTodoLists();
            loadTodoLists();
            document.querySelector(`.taskInput[data-list-name="${listName}"]`).value = "";
        }
    }

    function toggleTask(id, listName) {
        const currentList = todoLists.find((list) => list.name === listName);
        const taskIndex = currentList.tasks.findIndex((task) => task.id === id);
        currentList.tasks[taskIndex].completed = !currentList.tasks[taskIndex].completed;
        saveTodoLists();
        loadTodoLists();
    }

    function deleteList(listName) {
        todoLists = todoLists.filter((list) => list.name !== listName);
        saveTodoLists();
        loadTodoLists();
    }

    function saveTodoLists() {
        localStorage.setItem("todoLists", JSON.stringify(todoLists));
    }
});
