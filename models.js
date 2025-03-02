// Data Models
class TodoApp {
    constructor() {
        this.areasOfLife = [];
        this.tasks = [];
        this.habits = [];
        this.loadFromStorage();
    }

    loadFromStorage() {
        const savedData = localStorage.getItem('todoAppData');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.areasOfLife = data.areasOfLife || [];
            this.tasks = data.tasks.map(task => new Task(task)) || [];
            this.habits = data.habits.map(habit => new Habit(habit)) || [];
        }
    }

    saveToStorage() {
        localStorage.setItem('todoAppData', JSON.stringify({
            areasOfLife: this.areasOfLife,
            tasks: this.tasks,
            habits: this.habits
        }));
    }

    addTask(taskData) {
        const task = new Task(taskData);
        this.tasks.push(task);
        this.saveToStorage();
        return task;
    }

    addHabit(habitData) {
        const habit = new Habit(habitData);
        this.habits.push(habit);
        this.saveToStorage();
        return habit;
    }

    toggleTaskComplete(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveToStorage();
        }
    }

    getTasksByTimeOfDay(timeOfDay) {
        return this.tasks.filter(task => task.timeOfDay === timeOfDay);
    }
}

class Task {
    constructor(data) {
        this.id = data.id || Date.now().toString();
        this.title = data.title;
        this.description = data.description || '';
        this.completed = data.completed || false;
        this.priority = data.priority || 'medium';
        this.dueDate = data.dueDate || null;
        this.timeOfDay = data.timeOfDay || 'morning';
        this.projectId = data.projectId || null;
        this.goalId = data.goalId || null;
        this.created = data.created || new Date().toISOString();
        this.isTimerActive = false;
        this.timerInterval = null;
    }
}

class Habit {
    constructor(data) {
        this.id = data.id || Date.now().toString();
        this.title = data.title;
        this.streak = data.streak || 0;
        this.lastCompleted = data.lastCompleted || null;
        this.completedDates = data.completedDates || [];
    }

    completeForToday() {
        const today = new Date().toDateString();
        if (!this.completedDates.includes(today)) {
            this.completedDates.push(today);
            this.updateStreak();
        }
    }

    updateStreak() {
        // Calculate streak based on consecutive days
        const today = new Date();
        let streak = 0;
        let currentDate = today;

        for (let i = this.completedDates.length - 1; i >= 0; i--) {
            const completedDate = new Date(this.completedDates[i]);
            const diffDays = Math.floor((currentDate - completedDate) / (1000 * 60 * 60 * 24));
            
            if (diffDays <= 1) {
                streak++;
                currentDate = completedDate;
            } else {
                break;
            }
        }

        this.streak = streak;
    }
}

// Initialize the app
const todoApp = new TodoApp();

// Add event listener to quick add input
const quickAddInput = document.getElementById('quickAddTask');
quickAddInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && quickAddInput.value.trim()) {
        const taskData = {
            title: quickAddInput.value.trim(),
            timeOfDay: 'morning' // default value, can be modified later
        };
        
        const newTask = todoApp.addTask(taskData);
        renderTask(newTask);
        quickAddInput.value = '';
    }
});

// Function to render a single task
function renderTask(task) {
    const timeSection = document.querySelector(`.task-list[data-time="${task.timeOfDay}"]`);
    
    const taskElement = document.createElement('div');
    taskElement.className = 'task-item';
    taskElement.draggable = true;
    
    taskElement.innerHTML = `
        <div class="task-checkbox">
            <input type="checkbox" id="task-${task.id}" ${task.completed ? 'checked' : ''}>
            <label for="task-${task.id}"></label>
        </div>
        <div class="task-content">
            <span class="task-title">${task.title}</span>
            <div class="task-meta">
                ${task.projectId ? `<span class="project-tag">Project</span>` : ''}
                ${task.priority === 'high' ? '<span class="material-icons priority-high">flag</span>' : ''}
            </div>
        </div>
    `;

    // Add checkbox event listener
    const checkbox = taskElement.querySelector(`#task-${task.id}`);
    checkbox.addEventListener('change', () => {
        todoApp.toggleTaskComplete(task.id);
    });

    timeSection.appendChild(taskElement);
} 