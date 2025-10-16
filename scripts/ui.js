export class UIManager {
    constructor(state) {
        this.state = state;
        this.taskListElement = document.getElementById('task-list');
    }

    // this section is for task rendering
    renderTasks() {
        if (!this.taskListElement) return;
        this.taskListElement.innerHTML = '';

        const tasks = this.state.getTasks();

        if (!tasks || tasks.length === 0) {
            this.taskListElement.innerHTML =
                `<p style="color: #6b7280;">No tasks available yet. Add one using the form.</p>`;
            return;
        }

        tasks.forEach(task => this.renderTaskCard(task));
    }

    renderTaskCard(task) {
        const [datePart] = task.dueDate ? task.dueDate.split('T') : ['N/A'];
        const timeDisplay = task.startTime && task.endTime && task.duration
            ? `${task.startTime} → ${task.endTime} (${task.duration} mins)`
            : 'No time set';

        const card = document.createElement('div');
        card.className = 'task-card shadow-md';
        card.dataset.id = task.id;

        card.innerHTML = `
            <h3 class="task-title">${this.escapeHtml(task.title)}</h3>
            <p><strong>📅 Due:</strong> ${datePart}</p>
            <p><strong>🕒 Time:</strong> ${timeDisplay}</p>
            <p><strong>🏷️ Tag:</strong> ${task.tag || 'N/A'}</p>
            <div class="card-actions">
                <button class="btn btn-edit" data-action="edit" data-id="${task.id}">Edit</button>
                <button class="btn btn-delete" data-action="delete" data-id="${task.id}">Delete</button>
            </div>
        `;

        this.taskListElement.appendChild(card);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }


    // any notifications and error handlers needed, i'm tackling that here
    showMessage(message, type = 'info') {
        const messageBox = document.getElementById('form-message');
        if (!messageBox) return;

        messageBox.textContent = message;
        messageBox.className = `form-message ${type}`;
        messageBox.style.display = 'block';

        setTimeout(() => {
            messageBox.style.display = 'none';
        }, 3000);
    }

// form mode switching between edit and add task is here
    updateFormMode(mode) {
        const formTitle = document.getElementById('form-title');
        const submitBtn = document.getElementById('form-submit-btn');
        if (!formTitle || !submitBtn) return;

        if (mode === 'edit') {
            formTitle.textContent = '✏️ Edit Task';
            submitBtn.textContent = 'Update Task';
            submitBtn.classList.add('btn-edit-mode');
        } else {
            formTitle.textContent = '➕ Add Task';
            submitBtn.textContent = 'Add Task';
            submitBtn.classList.remove('btn-edit-mode');
        }
    }

//  the popup on delete and edit
    showModal(message, onConfirm) {
        const modal = document.getElementById('custom-modal');
        const modalMessage = document.getElementById('modal-message');
        if (!modal || !modalMessage) return;

        modalMessage.textContent = message;
        modal.style.display = 'flex';

        const confirmBtn = document.getElementById('modal-confirm-btn');
        const cancelBtn = document.getElementById('modal-cancel-btn');

        const cleanup = () => {
            modal.style.display = 'none';
            confirmBtn.replaceWith(confirmBtn.cloneNode(true));
            cancelBtn.replaceWith(cancelBtn.cloneNode(true));
        };

        confirmBtn.onclick = () => {
            onConfirm();
            cleanup();
        };

        cancelBtn.onclick = cleanup;
    }
}
