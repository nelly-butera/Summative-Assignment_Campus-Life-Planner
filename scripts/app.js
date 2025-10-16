// scripts/app.js
import { UIManager } from './ui.js';
import { StateManager } from './state.js';
import { StorageManager } from './storage.js';
import { SearchManager } from './search.js';
import { validateTask, clearInlineErrors, showInlineError } from './validation.js';
import { populateTimeDropdowns, setupTimeDurationListeners } from './form.js';

export class TaskPlannerApp {
    constructor() {
        console.log("✅ TaskPlannerApp constructor called");

        // Initialize core modules
        this.state = new StateManager();
        this.storage = new StorageManager(); // ✅ fixed
        this.ui = new UIManager(this.state);
        this.searchManager = new SearchManager(this.state, this.ui);

        this.currentEditId = null;

        // Initialize app lifecycle
        this.init();
    }

    /** ============================
     *  INITIALIZATION
     *  ============================ */
    init() {
        console.log("⚙️ Initializing TaskPlannerApp...");

        this.loadStoredTasks();
        this.bindFormEvents();
        this.bindTaskActions();
        this.setupTheme();
        this.setupNavigation();
        this.setupSearch();

        populateTimeDropdowns();
        setupTimeDurationListeners();

        this.ui.showMessage("Planner ready!", "success");
    }

    /** ============================
     *  LOAD SAVED TASKS
     *  ============================ */
    loadStoredTasks() {
        const saved = this.storage.loadTasks();
        this.state.setTasks(saved);
        this.ui.renderTasks();
    }

    /** ============================
     *  FORM HANDLING
     *  ============================ */
    bindFormEvents() {
        const form = document.getElementById('task-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        const resetBtn = document.getElementById('form-reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.clearForm());
        }
    }

    getFormData() {
        return {
            id: this.currentEditId || Date.now(),
            title: document.getElementById('title').value.trim(),
            dueDate: document.getElementById('dueDate').value,
            startTime: `${document.getElementById('startHour').value}:${document.getElementById('startMinute').value}`,
            endTime: `${document.getElementById('endHour').value}:${document.getElementById('endMinute').value}`,
            duration: document.getElementById('duration').value,
            tag: document.getElementById('tag').value.trim(),
        };
    }

    handleFormSubmit() {
        clearInlineErrors();
        const task = this.getFormData();

        const validationMessage = validateTask(task);
        if (validationMessage) {
            this.ui.showMessage(validationMessage, 'error');
            showInlineError('title', validationMessage);
            return;
        }

        if (this.currentEditId) {
            // ✅ Update existing task
            this.state.updateTask(this.currentEditId, task);
            this.ui.showMessage('Task updated successfully!', 'success');
            this.currentEditId = null;
        } else {
            // ✅ Create new task
            this.state.addTask(task);
            this.ui.showMessage('Task added successfully!', 'success');
        }

        // Save + render
        this.storage.saveTasks(this.state.getTasks());
        this.ui.renderTasks();
        this.clearForm();
    }

    clearForm() {
        const form = document.getElementById('task-form');
        if (form) form.reset();
        clearInlineErrors();
        this.currentEditId = null;
        this.ui.updateFormMode('add'); // optional, if you support changing form title/button text
    }

    /** ============================
     *  TASK ACTIONS (EDIT/DELETE)
     *  ============================ */
    bindTaskActions() {
        document.addEventListener('click', (e) => {
            const editBtn = e.target.closest('.edit-btn');
            const deleteBtn = e.target.closest('.delete-btn');

            if (editBtn) {
                const id = parseInt(editBtn.dataset.id);
                this.editTask(id);
            }

            if (deleteBtn) {
                const id = parseInt(deleteBtn.dataset.id);
                this.confirmDelete(id);
            }
        });
    }

    editTask(id) {
        const task = this.state.getTaskById(id);
        if (!task) return;

        this.currentEditId = id;

        document.getElementById('title').value = task.title;
        document.getElementById('dueDate').value = task.dueDate;
        document.getElementById('tag').value = task.tag || '';

        if (task.startTime) {
            const [sh, sm] = task.startTime.split(':');
            document.getElementById('startHour').value = sh;
            document.getElementById('startMinute').value = sm;
        }

        if (task.endTime) {
            const [eh, em] = task.endTime.split(':');
            document.getElementById('endHour').value = eh;
            document.getElementById('endMinute').value = em;
        }

        document.getElementById('duration').value = task.duration || '';
        window.showPage('form');

        this.ui.updateFormMode('edit')
    }


    confirmDelete(id) {
        if (confirm("Are you sure you want to delete this task?")) {
            this.state.deleteTask(id);
            this.storage.saveTasks(this.state.getTasks());
            this.ui.renderTasks();
            this.ui.showMessage("Task deleted.", "success");
        }
    }

    /** ============================
     *  THEME TOGGLING
     *  ============================ */
    setupTheme() {
        const body = document.querySelector('html');
        const toggle = document.getElementById('theme-toggle');
        const sun = document.getElementById('sun-icon');
        const moon = document.getElementById('moon-icon');

        if (!toggle) return;

        const saved = localStorage.getItem('theme') || 'light';
        body.dataset.theme = saved;
        sun.style.display = saved === 'dark' ? 'none' : 'block';
        moon.style.display = saved === 'dark' ? 'block' : 'none';

        toggle.addEventListener('click', () => {
            const newTheme = body.dataset.theme === 'dark' ? 'light' : 'dark';
            body.dataset.theme = newTheme;
            localStorage.setItem('theme', newTheme);
            sun.style.display = newTheme === 'dark' ? 'none' : 'block';
            moon.style.display = newTheme === 'dark' ? 'block' : 'none';
        });
    }

    /** ============================
     *  NAVIGATION
     *  ============================ */
    setupNavigation() {
        const sections = document.querySelectorAll('.page-section');
        const navItems = document.querySelectorAll('.nav-item');

        window.showPage = (pageId) => {
            sections.forEach(sec => sec.classList.remove('active'));
            const target = document.getElementById(pageId);
            if (target) target.classList.add('active');

            navItems.forEach(item => item.classList.remove('active'));
            const activeNav = document.getElementById(`nav-${pageId}`);
            if (activeNav) activeNav.classList.add('active');
        };

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                window.showPage(item.dataset.target);
            });
        });

        window.showPage('dashboard');
    }

    /** ============================
     *  SEARCH
     *  ============================ */
    setupSearch() {
        const searchInput = document.getElementById('search-input');
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            const pattern = e.target.value.trim();
            if (!pattern) {
                this.ui.renderTasks();
                return;
            }
            this.searchManager.search(pattern);
        });
    }
}
