// Handle task addition
document.querySelector('.add-task-btn').addEventListener('click', function() {
    const taskName = prompt("Enter task name:");
    const taskList = document.querySelector('.task-list');
    if (taskName) {
      const taskHTML = `<div class="task"><h3>${taskName}</h3><button>Edit</button></div>`;
      taskList.innerHTML += taskHTML;
    }
  });
  
  // Handle note addition
  document.querySelector('.add-note-btn').addEventListener('click', function() {
    const noteTitle = prompt("Enter note title:");
    const noteList = document.querySelector('.note-list');
    if (noteTitle) {
      const noteHTML = `<div class="note"><h3>${noteTitle}</h3><p>Note content...</p><button>Edit</button></div>`;
      noteList.innerHTML += noteHTML;
    }
  });
  