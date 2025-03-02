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
        this.timeRemaining = 25 * 60; // 25 minutes in seconds
    }

    startTimer(callback) {
        if (!this.isTimerActive) {
            this.isTimerActive = true;
            this.timerInterval = setInterval(() => {
                this.timeRemaining--;
                if (this.timeRemaining <= 0) {
                    this.stopTimer();
                    if (callback) callback();
                }
            }, 1000);
        }
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
            this.isTimerActive = false;
            this.timeRemaining = 25 * 60;
        }
    }

    getFormattedTimeRemaining() {
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

class Goal {
    constructor(data) {
        this.id = data.id || Date.now().toString();
        this.title = data.title;
        this.description = data.description || '';
        this.deadline = data.deadline || null;
        this.progress = data.progress || 0;
        this.status = data.status || 'active'; // active, completed, abandoned
        this.tasks = [];
        this.created = data.created || new Date().toISOString();
    }

    addTask(task) {
        this.tasks.push(task);
        this.updateProgress();
    }

    removeTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.updateProgress();
    }

    updateProgress() {
        if (this.tasks.length === 0) {
            this.progress = 0;
            return;
        }
        const completed = this.tasks.filter(task => task.completed).length;
        this.progress = (completed / this.tasks.length) * 100;
    }
} 