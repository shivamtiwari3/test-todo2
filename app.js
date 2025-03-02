class TodoAppUI {
    // ... existing code ...

    initializeEventListeners() {
        // ... existing event listeners ...

        // Task Action Handlers
        document.addEventListener('click', (e) => {
            const taskItem = e.target.closest('.task-item');
            if (!taskItem) return;
            
            const taskId = taskItem.dataset.taskId;
            
            if (e.target.matches('.task-timer')) {
                this.handleTaskTimer(taskId);
            } else if (e.target.matches('.task-flag')) {
                this.handleTaskPriority(taskId);
            } else if (e.target.matches('.task-folder')) {
                this.handleTaskProject(taskId);
            }
        });
    }

    handleTaskTimer(taskId) {
        const task = this.app.getTask(taskId);
        if (!task) return;
        
        // Toggle timer state
        task.isTimerActive = !task.isTimerActive;
        
        // Implementation example - you can customize based on your needs
        if (task.isTimerActive) {
            // Start a 25-minute timer (Pomodoro style)
            task.timerInterval = setInterval(() => {
                // Update timer display
                // Add your timer logic here
            }, 1000);
        } else {
            clearInterval(task.timerInterval);
        }
        
        this.renderTasks(); // Re-render to update UI
    }

    handleTaskPriority(taskId) {
        const task = this.app.getTask(taskId);
        if (!task) return;
        
        // Cycle through priority levels: none -> low -> medium -> high
        const priorities = ['none', 'low', 'medium', 'high'];
        const currentIndex = priorities.indexOf(task.priority || 'none');
        task.priority = priorities[(currentIndex + 1) % priorities.length];
        
        this.renderTasks(); // Re-render to update UI
    }

    handleTaskProject(taskId) {
        const task = this.app.getTask(taskId);
        if (!task) return;
        
        // Show project selection modal
        const projectModal = document.createElement('div');
        projectModal.className = 'modal';
        projectModal.innerHTML = `
            <div class="modal-content">
                <h3>Select Project</h3>
                <div class="project-list">
                    ${this.app.getProjects().map(project => `
                        <div class="project-item" data-project-id="${project.id}">
                            ${project.name}
                        </div>
                    `).join('')}
                </div>
                <button class="new-project-btn">+ New Project</button>
            </div>
        `;
        
        document.body.appendChild(projectModal);
        
        // Handle project selection
        projectModal.addEventListener('click', (e) => {
            const projectItem = e.target.closest('.project-item');
            if (projectItem) {
                task.projectId = projectItem.dataset.projectId;
                this.renderTasks();
                projectModal.remove();
            }
        });
    }
}

function renderTask(task) {
    const taskHTML = `
        <div class="task-item" draggable="true" data-task-id="${task.id}">
            <div class="task-checkbox">
                <input type="checkbox" id="task-${task.id}" ${task.completed ? 'checked' : ''}>
                <label for="task-${task.id}"></label>
            </div>
            <div class="task-content">
                <span class="task-title">${task.title}</span>
                <div class="task-meta">
                    ${task.projectId ? `<span class="project-tag">Project</span>` : ''}
                    <button class="task-timer material-icons" title="Timer">timer</button>
                    <button class="task-flag material-icons" title="Priority">
                        ${task.priority === 'high' ? 'flag' : 'outlined_flag'}
                    </button>
                    <button class="task-folder material-icons" title="Add to Project">folder</button>
                </div>
            </div>
            ${task.isTimerActive ? `
                <div class="task-timer-display">25:00</div>
            ` : ''}
        </div>
    `;

    const timeSection = document.querySelector(`.task-list[data-time="${task.timeOfDay}"]`);
    if (timeSection) {
        timeSection.insertAdjacentHTML('beforeend', taskHTML);
    }
} 