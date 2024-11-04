document.addEventListener("DOMContentLoaded", function() {
    const sections = document.querySelectorAll(".template-section");

    sections.forEach(section => {
        const addFolderBtn = section.querySelector(".add-folder-btn");
        const folderContainer = section.querySelector(".folder-container");

        addFolderBtn.addEventListener("click", function() {
            createNewFolder(folderContainer, section.id);
        });
    });

    function createNewFolder(container, sectionId) {
        const folder = document.createElement("div");
        folder.classList.add("folder");

        folder.innerHTML = `
            <h3>New Folder</h3>
            <ul class="task-list"></ul>
            <button class="add-task-btn">${getAddTaskButtonText(sectionId)}</button>
            <div class="folder-controls">
                <span class="icon edit-icon" title="Edit Folder"><i class="fas fa-edit"></i></span>
                <span class="icon delete-icon" title="Delete Folder"><i class="fas fa-trash"></i></span>
            </div>
            <div class="total-expense" style="display: none;">Total Expenses: $<span class="total-cost">0</span></div>
        `;

        container.appendChild(folder);

        const editFolderBtn = folder.querySelector(".edit-icon");
        const deleteFolderBtn = folder.querySelector(".delete-icon");
        const addTaskBtn = folder.querySelector(".add-task-btn");
        const taskList = folder.querySelector(".task-list");
        const totalCostDisplay = folder.querySelector(".total-cost");
        const totalExpenseDiv = folder.querySelector(".total-expense");

        editFolderBtn.addEventListener("click", function() {
            editFolderName(folder);
        });

        deleteFolderBtn.addEventListener("click", function() {
            container.removeChild(folder);
        });

        addTaskBtn.addEventListener("click", function() {
            createNewTask(taskList, sectionId, totalCostDisplay, totalExpenseDiv);
        });
    }

    function getAddTaskButtonText(sectionId) {
        if (sectionId === "shopping-lists") return "Add Item";
        if (sectionId === "student-planners") return "Add Task";
        if (sectionId === "financial-planners") return "Add Expense";
        return "Add Task";
    }

    function createNewTask(list, sectionId, totalCostDisplay, totalExpenseDiv) {
        const task = document.createElement("li");
        task.classList.add("task");
        
        let taskContent = '';
        if (sectionId === "shopping-lists") {
            taskContent = `
                <input type="text" placeholder="Item" class="task-name" style="flex-grow: 1; width: 200px; height: 30px; font-size: 1rem;">
                <input type="number" min="1" value="1" class="task-quantity" style="height: 30px;">
                <input type="checkbox" class="task-checkbox" style="margin-left: 10px;">
            `;
        } else if (sectionId === "student-planners") {
            taskContent = `
                <input type="text" placeholder="Task" class="task-name" style="flex-grow: 1; width: 200px; height: 30px; font-size: 1rem;">
                <input type="time" class="task-time" style="height: 30px;">
                <input type="checkbox" class="task-checkbox" style="margin-left: 10px;">
            `;
        } else if (sectionId === "financial-planners") {
            taskContent = `
                <input type="text" placeholder="Expense" class="task-name expense-input" style="flex-grow: 1; width: 200px; height: 30px; font-size: 1rem;">
                <input type="number" min="0" value="0" class="task-amount" style="height: 30px;">
                <!-- No checkbox for financial planner -->
            `;
        }
        
        task.innerHTML = taskContent + `
            <div class="task-controls">
                <span class="icon edit-task-icon" title="Edit Task"><i class="fas fa-edit"></i></span>
                <span class="icon delete-task-icon" title="Delete Task"><i class="fas fa-trash"></i></span>
            </div>
        `;
        list.appendChild(task);
    
        const editTaskBtn = task.querySelector(".edit-task-icon");
        const deleteTaskBtn = task.querySelector(".delete-task-icon");
        const amountInput = task.querySelector(".task-amount");
        const checkbox = task.querySelector(".task-checkbox");

        editTaskBtn.addEventListener("click", function() {
            editTaskName(task);
            alert("Edit Task functionality to be implemented.");
        });

        deleteTaskBtn.addEventListener("click", function() {
            list.removeChild(task);
            updateTotalCost(totalCostDisplay, totalExpenseDiv);
        });

        if (sectionId === "financial-planners") {
            amountInput.addEventListener("input", function() {
                updateTotalCost(totalCostDisplay, totalExpenseDiv);
            });
        }

        checkbox.addEventListener("change", function() {
            if (checkbox.checked) {
                task.classList.add("completed");
            } else {
                task.classList.remove("completed");
            }
        });
    }

    function updateTotalCost(totalCostDisplay, totalExpenseDiv) {
        let totalCost = 0;
        const expenses = document.querySelectorAll(".task-amount");
        expenses.forEach(expense => {
            totalCost += parseFloat(expense.value) || 0;
        });
        totalCostDisplay.textContent = totalCost.toFixed(2);
        totalExpenseDiv.style.display = totalCost > 0 ? "block" : "none";
    }

    function editFolderName(folder) {
        const folderName = folder.querySelector("h3");
        const newName = prompt("Enter new folder name:", folderName.textContent);
        if (newName) {
            folderName.textContent = newName;
        }
    }

    function editTaskName(task) {
        const taskName = task.querySelector(".task-name");
        const newName = prompt("Enter new task name:", taskName.value);
        if (newName) {
            taskName.value = newName;
        }
    }
});
