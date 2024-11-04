document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('task-calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        selectable: true,
        dateClick: function(info) {
            const selectedDate = info.dateStr;
            document.getElementById('selected-date').textContent = selectedDate;

            // Clear previous tasks
            const taskList = document.getElementById('task-list');
            taskList.innerHTML = '';

            // Fetch and display tasks for the selected date
            const tasks = getTasksForDate(selectedDate);
            tasks.forEach(task => {
                const taskItem = document.createElement('li');
                taskItem.textContent = `${task.time} - ${task.title}`;
                taskList.appendChild(taskItem);
            });
        },
        events: fetchCalendarEvents() // Load calendar with tasks/events
    });

    calendar.render();
});

// Sample task data (can be replaced with dynamic data)
const taskData = {
    "2024-10-20": [
        { time: "10:00 AM", title: "Project meeting" },
        { time: "1:00 PM", title: "Code review" }
    ],
    "2024-10-21": [
        { time: "2:00 PM", title: "Client call" },
        { time: "4:30 PM", title: "Team sync" }
    ]
};

function getTasksForDate(date) {
    return taskData[date] || [];
}

function fetchCalendarEvents() {
    const events = [];
    for (const date in taskData) {
        taskData[date].forEach(task => {
            events.push({
                title: task.title,
                start: `${date}T${convertTo24HourFormat(task.time)}`
            });
        });
    }
    return events;
}

function convertTo24HourFormat(time) {
    const [hours, minutes, period] = time.match(/(\d+):(\d+)\s?(AM|PM)/).slice(1);
    let hour = parseInt(hours, 10);
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    return `${hour.toString().padStart(2, '0')}:${minutes}`;
}

// Function to display tasks in the calendar
function displayTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const calendarTasksDiv = document.getElementById('calendarTasks');
    
    if (tasks.length === 0) {
        calendarTasksDiv.innerHTML = '<p>No tasks scheduled yet!</p>';
        return;
    }

    const taskList = document.createElement('ul');
    
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = `${task.title} (Due: ${task.date}) - ${task.section}`;
        taskList.appendChild(li);
    });

    calendarTasksDiv.innerHTML = '';
    calendarTasksDiv.appendChild(taskList);
}

// Call the display function when the page loads
document.addEventListener('DOMContentLoaded', displayTasks);
