// scripts/state.js
class StateManager {
    constructor() {
        this.tasks = [];
        this.currentFilter = null;
    }

    setTasks(tasks) {
        this.tasks = tasks;
        this.sort('dueDate', true);
    }

    getTasks() {
        return this.tasks;
    }

    addTask(task) {
        this.tasks.push(task);
    }

    updateTask(id, updatedData) {
        const index = this.tasks.findIndex(t => t.id === id);
        if (index !== -1) {
            this.tasks[index] = { ...this.tasks[index], ...updatedData };
            return true;
        }
        return false;
    }

    deleteTask(id) {
        const initialLength = this.tasks.length;
        this.tasks = this.tasks.filter(t => t.id !== id);
        return this.tasks.length < initialLength;
    }

    getTaskById(id) {
        return this.tasks.find(t => t.id === id);
    }

    sort(field, ascending = true) {
        this.tasks.sort((a, b) => {
            let valA = a[field];
            let valB = b[field];

            if (field === 'duration') {
                valA = Number(valA);
                valB = Number(valB);
            }

            if (field === 'dueDate') {
                valA = new Date(valA);
                valB = new Date(valB);
            }

            if (valA < valB) return ascending ? -1 : 1;
            if (valA > valB) return ascending ? 1 : -1;
            return 0;
        });
    }

    fillMissingDurations() {
        this.tasks.forEach(task => {
            if (!task.startTime || !task.endTime) {
                task.startTime = '09:00';
                task.endTime = '10:00';
                task.duration = 60;
            } else if (!task.duration || task.duration <= 0) {
                const [startHour, startMinute] = task.startTime.split(':').map(Number);
                const [endHour, endMinute] = task.endTime.split(':').map(Number);
                let duration = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
                if (duration < 0) duration += 24 * 60;
                task.duration = duration;
            }
        });
    }
}

export { StateManager};