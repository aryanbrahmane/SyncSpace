document.addEventListener("DOMContentLoaded", () => {
  const quickTaskForm = document.getElementById("quickTaskForm");
  const quickTaskList = document.getElementById("quickTaskList");
  const taskFolders = document.getElementById("taskFolders");
  const addFolderBtn = document.getElementById("addFolderBtn");

  const userId = localStorage.getItem("userId"); // Get userId from localStorage

  // Fetch existing tasks on page load
  fetchQuickTasks();

  // Function to fetch quick tasks
  async function fetchQuickTasks() {
    try {
      const response = await fetch(
        "http://localhost:3000/api/task/getallQuickTaskbyId",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );
      const data = await response.json();

      if (data.success) {
        quickTaskList.innerHTML = "";
        data.quicktask.forEach((task) => {
          const taskItem = createTaskElement(task.task, task.isdone, task._id);
          quickTaskList.appendChild(taskItem);
        });
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }

  // Updated quick task form submission
  quickTaskForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const taskTitle = document.getElementById("quickTaskTitle").value;

    if (taskTitle) {
      try {
        const response = await fetch(
          "http://localhost:3000/api/task/addQuickTask",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId,
              task: taskTitle,
            }),
          }
        );
        const data = await response.json();

        if (data.success) {
          const taskItem = createTaskElement(taskTitle, false);
          quickTaskList.appendChild(taskItem);
          quickTaskForm.reset();
        }
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  });

  // Updated createTaskElement function
  function createTaskElement(taskTitle, isDone = false, taskId) {
    const taskItem = document.createElement("li");
    taskItem.classList.add("task-item");
    if (taskId) {
      taskItem.dataset.taskId = taskId;
    }

    taskItem.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${
              isDone ? "checked" : ""
            } onclick="updateTaskProgress(this)" />
            <span contenteditable="false">${taskTitle}</span>
            <input type="date" class="task-date" style="display:none;" />
            <div class="task-icons">
                <i class="fas fa-edit" onclick="editTask(this)" title="Edit"></i>
                <i class="fas fa-calendar" onclick="scheduleTask(this)" title="Schedule"></i>
                <i class="fas fa-trash-alt" onclick="deleteTask(this)" title="Delete"></i>
            </div>
        `;

    return taskItem;
  }

  // Function to add a new folder
  addFolderBtn.addEventListener("click", (e) => {
    e.stopImmediatePropagation();
    const newFolder = createFolderElement(); // Create a new folder using the existing function
    taskFolders.insertBefore(newFolder, addFolderBtn); // Insert the folder before the 'Add Folder' button

    // Re-attach event listeners for the newly created folder
    attachFolderEventListeners(newFolder);
  });

  // Function to attach necessary event listeners to a folder
  function attachFolderEventListeners(folder) {
    // Add task inside folder functionality
    const folderTaskForm = folder.querySelector(".folder-task-form");
    folderTaskForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const taskInput = folder.querySelector(".folder-task-input");
      const taskTitle = taskInput.value;

      if (taskTitle) {
        const taskList = folder.querySelector(".folder-task-list");
        const taskItem = createTaskElement(taskTitle);
        taskList.appendChild(taskItem);
        taskInput.value = "";
        updateProgressBar(folder); // Update progress bar after adding a task
      }
    });

    // Add delete folder functionality
    const deleteBtn = folder.querySelector(".delete-folder-btn");
    deleteBtn.addEventListener("click", () => {
      folder.remove();
    });
  }

  // Function to update progress bar
  const updateProgressBar = (folder) => {
    const taskList = folder.querySelector(".folder-task-list");
    const tasks = taskList.querySelectorAll("li");
    const totalTasks = tasks.length;
    const completedTasks = Array.from(tasks).filter(
      (task) => task.querySelector('input[type="checkbox"]').checked
    ).length;
    const progressPercentage = totalTasks
      ? (completedTasks / totalTasks) * 100
      : 0;

    const progressFill = folder.querySelector(".progress-fill");
    const progressText = folder.querySelector(".progress-percentage");

    progressFill.style.width = `${progressPercentage}%`;
    progressText.textContent = `${Math.round(progressPercentage)}%`;
  };

  // Function to create a folder element
  function createFolderElement() {
    const folder = document.createElement("div");
    folder.classList.add("folder");

    folder.innerHTML = `
            <div class="folder-banner">
                <img src="folder-banner.jpg" alt="Banner" class="banner-img">
            </div>
            <h3 contenteditable="true">New Folder</h3>
            <p contenteditable="true">Manage your tasks...</p>
            <div class="progress-bar">
                <div class="progress-fill" style="width: 0%;"></div>
                <span class="progress-percentage">0%</span>
            </div>
            <form class="folder-task-form">
                <input type="text" placeholder="Add task to this folder" class="folder-task-input">
                <button type="submit">Add Task</button>
            </form>
            <ul class="folder-task-list"></ul>
            <button class="edit-btn">Edit Folder</button>
            <button class="add-banner-btn">Add Banner</button>
            <button class="remove-banner-btn">Remove Banner</button>
            <button class="delete-folder-btn">Delete Folder</button>
            <input type="file" class="banner-upload" accept="image/*" style="display: none;">
        `;

    // Event listener to delete folder
    const deleteBtn = folder.querySelector(".delete-folder-btn");
    deleteBtn.addEventListener("click", () => {
      folder.remove();
    });

    // Handle adding tasks inside the folder
    const folderTaskForm = folder.querySelector(".folder-task-form");
    folderTaskForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const taskInput = folder.querySelector(".folder-task-input");
      const taskTitle = taskInput.value;

      if (taskTitle) {
        const taskList = folder.querySelector(".folder-task-list");
        const taskItem = createTaskElement(taskTitle);
        taskList.appendChild(taskItem);
        taskInput.value = "";
        updateProgressBar(folder); // Update progress bar after adding a task
      }
    });

    return folder;
  }

  // Folder task form submission (updates progress bar when tasks are added/deleted)
  taskFolders.addEventListener("submit", function (e) {
    e.preventDefault();
    const folder = e.target.closest(".folder");
    const taskInput = folder.querySelector(".folder-task-input");
    const taskTitle = taskInput.value;

    if (taskTitle) {
      const taskList = folder.querySelector(".folder-task-list");
      const taskItem = createTaskElement(taskTitle);
      taskList.appendChild(taskItem);
      taskInput.value = "";
      updateProgressBar(folder); // Update progress bar after adding a task
    }
  });

  // Update progress bar when task checkbox is clicked
  // Update the window.updateTaskProgress function in your-tasks.js
window.updateTaskProgress = async function (checkbox) {
  const taskItem = checkbox.closest(".task-item");
  const taskId = taskItem.dataset.taskId;
  const folder = taskItem.closest(".folder");

  // Only make API call for quick tasks (ones with taskId)
  if (taskId) {
    try {
      const response = await fetch("http://localhost:3000/api/task/isDoneQuickTask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("userId"),
          taskId: taskId
        }),
      });

      const data = await response.json();
      
      if (!data.success) {
        // Revert checkbox if request failed
        checkbox.checked = !checkbox.checked;
        alert("Failed to update task status: " + data.message);
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      // Revert checkbox if request failed
      checkbox.checked = !checkbox.checked;
      alert("Error updating task status. Please try again.");
    }
  }

  // Update progress bar if task is in a folder
  if (folder) {
    updateProgressBar(folder);
  }
};

  // Edit task functionality
  // Update editTask function to handle renaming with backend integration
  // Add this to your-tasks.js
  window.editTask = async function (icon) {
    const taskItem = icon.closest(".task-item");
    const taskText = taskItem.querySelector("span");
    const taskId = taskItem.dataset.taskId;
    const originalText = taskText.textContent.trim();

    // Only proceed if we have a taskId (quick task)
    if (!taskId) {
      console.error("No task ID found");
      return;
    }

    taskText.contentEditable = true;
    taskText.focus();

    // Function to handle the rename operation
    async function handleRename(newText) {
      if (newText === originalText) return;

      try {
        const response = await fetch(
          "http://localhost:3000/api/task/renameQuickTask",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: localStorage.getItem("userId"),
              taskId: taskId,
              task: newText,
            }),
          }
        );

        const data = await response.json();

        if (!data.success) {
          taskText.textContent = originalText;
          alert("Failed to rename task: " + data.message);
        }
      } catch (error) {
        console.error("Error renaming task:", error);
        taskText.textContent = originalText;
        alert("Error renaming task. Please try again.");
      }
    }

    // Handle Enter key press
    function handleKeydown(e) {
      if (e.key === "Enter") {
        e.preventDefault();
        taskText.contentEditable = false;
        const newText = taskText.textContent.trim();
        handleRename(newText);
      } else if (e.key === "Escape") {
        taskText.contentEditable = false;
        taskText.textContent = originalText;
      }
    }

    // Handle clicking outside
    function handleBlur() {
      if (taskText.contentEditable === "true") {
        taskText.contentEditable = false;
        const newText = taskText.textContent.trim();
        handleRename(newText);
      }
    }

    taskText.addEventListener("keydown", handleKeydown);
    taskText.addEventListener("blur", handleBlur, { once: true });
  };

  // Scheduling functionality
  window.scheduleTask = function (icon) {
    const taskItem = icon.parentElement.parentElement;
    const taskDate = taskItem.querySelector(".task-date");
    taskDate.style.display =
      taskDate.style.display === "inline" ? "none" : "inline";
  };

  // Delete task functionality
  window.deleteTask = async function (icon) {
    const taskItem = icon.parentElement.parentElement;
    const taskId = taskItem.dataset.taskId;
    const folder = taskItem.closest(".folder");

    if (!taskId) {
      // Handle folder tasks (non-quick tasks)
      taskItem.remove();
      if (folder) {
        updateProgressBar(folder);
      }
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/api/task/deleteQuickTask",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            taskId,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        taskItem.remove();
        if (folder) {
          updateProgressBar(folder);
        }
      } else {
        console.error("Failed to delete task:", data.message);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Banner upload functionality
  taskFolders.addEventListener("click", function (e) {
    if (e.target.classList.contains("add-banner-btn")) {
      const folder = e.target.closest(".folder");
      const bannerUpload = folder.querySelector(".banner-upload");
      bannerUpload.click();

      bannerUpload.addEventListener("change", function () {
        const file = this.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
            const bannerImg = folder.querySelector(".banner-img");
            bannerImg.src = e.target.result;
            // Use CSS to resize the image for better control
            bannerImg.style.width = "100%";
            bannerImg.style.height = "auto";
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Remove Banner functionality
    if (e.target.classList.contains("remove-banner-btn")) {
      const folder = e.target.closest(".folder");
      const bannerImg = folder.querySelector(".banner-img");
      bannerImg.src = ""; // Remove the banner image
    }
  });

  // Delete folder functionality
  const deleteFolderBtns = document.querySelectorAll(".delete-folder-btn");
  deleteFolderBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const folder = this.closest(".folder");
      folder.remove(); // Delete the entire task folder
    });
  });
});
