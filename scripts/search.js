// scripts/search.js
export class SearchManager {
    constructor(state, ui) {
        this.state = state;
        this.ui = ui;
    }

    search(pattern) {
        let regex;
        try {
            regex = new RegExp(pattern, 'i');
        } catch (e) {
            console.warn("Invalid regex:", e);
            return;
        }

        const taskListElement = document.getElementById('task-list');
        taskListElement.innerHTML = '';

        const tasks = this.state.getTasks();
        const matchedTasks = tasks.filter(task => regex.test(task.title));

        matchedTasks.forEach(task => {
            const card = this.ui.renderTaskCard(task);
            const titleElement = taskListElement.querySelector(`[data-id="${task.id}"] .task-title`);
            
            if (titleElement) {
                titleElement.innerHTML = task.title.replace(regex, match => `<mark>${match}</mark>`);
            }
        });
    }

    sort(field, ascending) {
        this.state.sort(field, ascending);
        this.ui.renderTasks();
    }
}