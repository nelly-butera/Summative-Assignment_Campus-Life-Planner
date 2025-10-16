// --- GLOBAL REFERENCES & DATA ---
const HTML_ELEMENT = document.documentElement;
const TASK_LIST_ELEMENT = document.getElementById('task-list');
const TASK_FORM = document.getElementById('task-form');
const FORM_TITLE = document.getElementById('form-title');
const FORM_SUBMIT_BTN = document.getElementById('form-submit-btn');
const FORM_MESSAGE = document.getElementById('form-message');

const PAGE_SECTIONS = document.querySelectorAll('.page-section');
const NAV_ITEMS = document.querySelectorAll('.nav-item');

// Modal Elements
const CUSTOM_MODAL = document.getElementById('custom-modal');
const MODAL_MESSAGE = document.getElementById('modal-message');
const MODAL_CONFIRM_BTN = document.getElementById('modal-confirm-btn');
const MODAL_CANCEL_BTN = document.getElementById('modal-cancel-btn');

const STORAGE_KEY = 'pureJSTasks';
let tasks = [];
let pendingDeleteTaskId = null; // Store the ID of the task being confirmed for deletion

// --- THEME LOGIC ---

/**
 * Initializes the theme from localStorage or system preference.
 */
function setupTheme() {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let theme;
    if (storedTheme) {
        theme = storedTheme;
    } else {
        theme = prefersDark ? 'dark' : 'light';
    }

    applyTheme(theme);
}

/**
 * Applies the theme to the HTML element and updates the toggle icons.
 * @param {string} theme - 'light' or 'dark'
 */
function applyTheme(theme) {
    HTML_ELEMENT.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    document.getElementById('sun-icon').style.display = (theme === 'dark' ? 'block' : 'none');
    document.getElementById('moon-icon').style.display = (theme === 'light' ? 'block' : 'none');
}

/**
 * Toggles between dark and light mode.
 */
function toggleTheme() {
    const currentTheme = HTML_ELEMENT.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
}

// --- NAVIGATION LOGIC ---

/**
 * Hides all page sections and shows the specified one.
 * Updates the navigation bar active state.
 * @param {string} pageId - The ID of the section to show (e.g., 'dashboard', 'form', 'about')
 */
function showPage(pageId) {
    // Hide all sections
    PAGE_SECTIONS.forEach(section => {
        section.classList.remove('active');
    });

    // Deactivate all nav items
    NAV_ITEMS.forEach(item => {
        item.classList.remove('active');
    });

    // Show the target section
    const activeSection = document.getElementById(pageId);
    if (activeSection) {
        activeSection.classList.add('active');
    }

    // Activate the corresponding nav item
    const activeNavItem = document.getElementById(`nav-${pageId}`);
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }
}

// --- TASK MANAGEMENT LOGIC (CRUD & LocalStorage) ---

/**
 * Loads tasks from localStorage.
 */
function loadTasks() {
    try {
        const storedTasks = localStorage.getItem(STORAGE_KEY);
        tasks = storedTasks ? JSON.parse(storedTasks) : [];
        // Sort by due date, then creation date
        tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate) || new Date(a.createdAt) - new Date(b.createdAt));
    } catch (error) {
        console.error("Error loading tasks from localStorage:", error);
        tasks = [];
    }
}

/**
 * Saves the current tasks array to localStorage.
 */
function saveTasks() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
        console.error("Error saving tasks to localStorage:", error);
    }
}

/**
 * Renders all tasks as cards in the dashboard.
 */
function renderTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    if (!tasks || tasks.length === 0) {
        taskList.innerHTML = `<p class="text-gray-500">No tasks available yet. Add one using the form.</p>`;
        return;
    }

    tasks.forEach(task => {
        // Extract date and times
        let displayDate = '';
        let displayTime = '';

        if (task.dueDate) {
            const [datePart, timePart] = task.dueDate.split('T');
            displayDate = datePart || '';
            if (timePart) {
                displayTime = timePart.substring(0, 5);
            }
        }

        // Handle start/end/duration display
        let timeDisplay = '';
        if (task.startTime && task.endTime && task.duration) {
            timeDisplay = `${task.startTime} → ${task.endTime} (${task.duration} mins)`;
        } else if (task.startTime) {
            timeDisplay = `${task.startTime}`;
        } else {
            timeDisplay = displayTime ? displayTime : 'No time set';
        }

        // Card creation
        const card = document.createElement('div');
        card.className = 'task-card shadow-md';
        card.dataset.id = task.id;


        card.innerHTML = `
            <h3 class="task-title">${task.title}</h3>
            <p><strong>📅 Due:</strong> ${displayDate || 'N/A'}</p>
            <p><strong>🕒 Time:</strong> ${timeDisplay}</p>
            <p><strong>🏷️ Tag:</strong> ${task.tag || 'N/A'}</p>
            <div class="card-actions">
                <button class="btn btn-edit" onclick="editTask('${task.id}')">Edit</button>
                <button class="btn btn-delete" onclick="showDeleteConfirmation('${task.id}')">Delete</button>
            </div>
        `;

        taskList.appendChild(card);
    });
    reattachCardEventListeners();

}

function reattachCardEventListeners() {
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.onclick = () => editTask(btn.closest('.task-card').dataset.id);
    });
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.onclick = () => showDeleteConfirmation(btn.closest('.task-card').dataset.id);
    });
}



/**
 * Calculates and updates task duration automatically.
 */
function updateDuration() {
    const startHour = parseInt(document.getElementById('startHour').value, 10);
    const startMinute = parseInt(document.getElementById('startMinute').value, 10);
    const endHour = parseInt(document.getElementById('endHour').value, 10);
    const endMinute = parseInt(document.getElementById('endMinute').value, 10);

    // Check if inputs are valid numbers
    if (isNaN(startHour) || isNaN(startMinute) || isNaN(endHour) || isNaN(endMinute)) {
        document.getElementById('duration').value = '';
        return;
    }

    const startTotal = startHour * 60 + startMinute;
    const endTotal = endHour * 60 + endMinute;

    let duration = endTotal - startTotal;

    if (duration < 0) {
        // If end time is before start, assume it crosses midnight
        duration += 24 * 60;
    }

    document.getElementById('duration').value = duration;
}


/**
 * Handles form submission for adding or updating a task.
 * @param {Event} e - The form submission event.
 */
function handleFormSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('task-id').value;
    const title = document.getElementById('title').value.trim();
    const dateInput = document.getElementById('dueDate').value; // YYYY-MM-DD

    // Use start time as the "due time" for the event's datetime
    const startHourEl = document.getElementById('startHour');
    const startMinuteEl = document.getElementById('startMinute');
    const endHourEl = document.getElementById('endHour');
    const endMinuteEl = document.getElementById('endMinute');

    const startHour = startHourEl ? startHourEl.value : '';
    const startMinute = startMinuteEl ? startMinuteEl.value : '';
    const endHour = endHourEl ? endHourEl.value : '';
    const endMinute = endMinuteEl ? endMinuteEl.value : '';

    // Duration (auto-calculated)
    const durationVal = document.getElementById('duration').value;
    const duration = parseInt(durationVal, 10);

    const tag = document.getElementById('tag').value;

    // Validation: require title, date, start and end times and valid duration
    if (!title || !dateInput || !startHour || !startMinute || !endHour || !endMinute || isNaN(duration) || duration <= 0) {
        showMessage("Please fill in all fields correctly (date, start/end times and duration).", "error");
        return;
    }

    // Safely pad
    const paddedStartHour = startHour.toString().padStart(2, '0');
    const paddedStartMinute = startMinute.toString().padStart(2, '0');

    // Build ISO-like due datetime using the start time (so cards show start time)
    const dueDateTimeString = `${dateInput}T${paddedStartHour}:${paddedStartMinute}:00`;

    const startTime = `${paddedStartHour}:${paddedStartMinute}`;
    const paddedEndHour = endHour.toString().padStart(2, '0');
    const paddedEndMinute = endMinute.toString().padStart(2, '0');
    const endTime = `${paddedEndHour}:${paddedEndMinute}`;

    const validationError = validateFormFields();
    if (validationError) {
        showMessage(validationError, 'error');
        return;
    }

    if (id) {
        // UPDATE existing task
        const taskIndex = tasks.findIndex(t => t.id === id);
        if (taskIndex !== -1) {
            tasks[taskIndex] = {
                ...tasks[taskIndex],
                title,
                dueDate: dueDateTimeString,
                startTime,
                endTime,
                duration,
                tag,
                updatedAt: new Date().toISOString()
            };
            showMessage("Task updated successfully!", "success");
        } else {
            showMessage("Task not found for update.", "error");
        }
    } else {
        // CREATE new task
        const newTask = {
            id: 'task_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
            title,
            dueDate: dueDateTimeString,
            startTime,
            endTime,
            duration,
            tag,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        tasks.push(newTask);
        showMessage("Task added successfully!", "success");
    }

    saveTasks();
    renderTasks();
    clearForm();
    showPage('dashboard');
}


/**
 * Auto-fill missing duration and start/end times for tasks.
 * @param {Array} taskArray - Array of task objects
 */
function fillMissingDurations(taskArray) {
    taskArray.forEach(task => {
        // If startTime or endTime is missing, assign default 1-hour slot
        if (!task.startTime || !task.endTime) {
            task.startTime = '09:00';
            task.endTime = '10:00';
            task.duration = 60;
        } else if (!task.duration || task.duration <= 0) {
            // Otherwise, calculate duration normally
            const [startHour, startMinute] = task.startTime.split(':').map(Number);
            const [endHour, endMinute] = task.endTime.split(':').map(Number);

            let startTotal = startHour * 60 + startMinute;
            let endTotal = endHour * 60 + endMinute;
            let duration = endTotal - startTotal;

            // Handle tasks that cross midnight
            if (duration < 0) duration += 24 * 60;

            task.duration = duration;
        }
    });
}



/**
 * Sets the form to edit mode with the data of a specific task.
 * @param {string} taskId - The ID of the task to edit.
 */
function editTask(taskId) {
    // Find the task in the global tasks array
    const task = tasks.find(t => t.id === taskId);
    if (!task) {
        showMessage("Task not found.", "error");
        return;
    }

    // Fill in form fields
    document.getElementById('task-id').value = task.id;
    document.getElementById('title').value = task.title;

    // Only the date part for date input
    const dateOnly = task.dueDate ? task.dueDate.split('T')[0] : '';
    document.getElementById('dueDate').value = dateOnly;

    document.getElementById('duration').value = task.duration || '';
    document.getElementById('tag').value = task.tag || '';

    // Populate start/end hour & minute dropdowns if available
    if (task.startTime) {
        const [startHour, startMinute] = task.startTime.split(':');
        document.getElementById('startHour').value = startHour.padStart(2, '0');
        document.getElementById('startMinute').value = startMinute.padStart(2, '0');
    } else {
        document.getElementById('startHour').value = '';
        document.getElementById('startMinute').value = '';
    }

    if (task.endTime) {
        const [endHour, endMinute] = task.endTime.split(':');
        document.getElementById('endHour').value = endHour.padStart(2, '0');
        document.getElementById('endMinute').value = endMinute.padStart(2, '0');
    } else {
        document.getElementById('endHour').value = '';
        document.getElementById('endMinute').value = '';
    }

    // Update form title and submit button text
    FORM_TITLE.textContent = "Edit Task";
    FORM_SUBMIT_BTN.textContent = "Update Task";

    // Auto-calculate duration if start and end times exist
    if (task.startTime && task.endTime) updateDuration();

    // Show the form page
    showPage('form');
}

/**
 * Clears the form and resets to 'Add New Task' mode.
 */
function clearForm() {
    TASK_FORM.reset();
    document.getElementById('task-id').value = '';
    FORM_TITLE.textContent = 'Add New Task';
    FORM_SUBMIT_BTN.textContent = 'Add Task';
    document.getElementById('duration').value = '';
    hideMessage();
}



/**
 * Resets the form to 'Add New Task' state.
 */
function clearForm() {
    TASK_FORM.reset();
    document.getElementById('task-id').value = '';
    FORM_TITLE.textContent = 'Add New Task';
    FORM_SUBMIT_BTN.textContent = 'Add Task';
    hideMessage();
}

/**
 * Shows a temporary message in the form section.
 * @param {string} message - The message content.
 * @param {string} type - 'success' or 'error' (currently just uses one style)
 */
function showMessage(message, type) {
    FORM_MESSAGE.textContent = message;
    FORM_MESSAGE.style.display = 'block';
    
    // Auto-hide the message after 3 seconds
    setTimeout(hideMessage, 3000);
}

/**
 * Hides the form message.
 */
function hideMessage() {
    FORM_MESSAGE.style.display = 'none';
}

// --- CUSTOM MODAL LOGIC ---

/**
 * Shows the custom confirmation modal and sets the pending task ID.
 * @param {string} taskId - The ID of the task to delete.
 */
function showDeleteConfirmation(taskId) {
    pendingDeleteTaskId = taskId;
    MODAL_MESSAGE.textContent = 'Are you sure you want to delete this task? This cannot be undone.';
    CUSTOM_MODAL.style.display = 'flex';
}

/**
 * Handles confirmation from the modal.
 * @param {boolean} confirmed - True if the user confirmed, false otherwise.
 */
function handleModalConfirmation(confirmed) {
    CUSTOM_MODAL.style.display = 'none';
    if (confirmed && pendingDeleteTaskId) {
        tasks = tasks.filter(t => t.id !== pendingDeleteTaskId);
        saveTasks();
        renderTasks();
    }
    pendingDeleteTaskId = null; // Reset pending task ID
}

//for time 
function populateTimeDropdowns() {
    const hourSelects = [document.getElementById('startHour'), document.getElementById('endHour')];
    const minuteSelects = [document.getElementById('startMinute'), document.getElementById('endMinute')];

    // Fill hours 00–23
    for (let i = 0; i < 24; i++) {
        const value = i.toString().padStart(2, '0');
        hourSelects.forEach(sel => {
            const opt = document.createElement('option');
            opt.value = value;
            opt.textContent = value;
            sel.appendChild(opt);
        });
    }

    // Fill minutes 00–59
    for (let i = 0; i < 60; i++) {
        const value = i.toString().padStart(2, '0');
        minuteSelects.forEach(sel => {
            const opt = document.createElement('option');
            opt.value = value;
            opt.textContent = value;
            sel.appendChild(opt);
        });
    }
}





// --- INITIALIZATION ---

window.onload = function() {
    // 1. Setup Theme
    setupTheme();
    
    // 2. Load and Render Tasks
    loadTasks();
    renderTasks();
    populateTimeDropdowns();
    
    // 3. Set Initial Page based on URL hash
    const initialHash = window.location.hash.substring(1) || 'dashboard';
    showPage(initialHash);
    
    // 4. Attach Form Listener
    TASK_FORM.addEventListener('submit', handleFormSubmit);

    // 5. Attach Modal Listeners
    MODAL_CONFIRM_BTN.addEventListener('click', () => handleModalConfirmation(true));
    MODAL_CANCEL_BTN.addEventListener('click', () => handleModalConfirmation(false));
    

    // Auto-calculate duration when start/end time changes
    ['startHour', 'startMinute', 'endHour', 'endMinute'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', updateDuration);
    });

    

    /**
     * Populates hour and minute dropdowns dynamically.
     */

};


// --- EXPORT LOGIC ---

/**
 * Export tasks as JSON file.
 */
function exportTasksJSON() {
    if (tasks.length === 0) {
        alert("No tasks to export.");
        return;
    }

    const dataStr = JSON.stringify(tasks, null, 2); // Pretty print
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'campusplanner.json';
    a.click();

    URL.revokeObjectURL(url);
}

/**
 * Convert tasks array to CSV string.
 */
function tasksToCSV() {
    if (tasks.length === 0) {
        alert("No tasks to export.");
        return '';
    }

    const headers = ["ID", "Title", "DueDate", "Duration", "Tag", "CreatedAt", "UpdatedAt"];
    const rows = tasks.map(t => [
        t.id,
        `"${t.title.replace(/"/g, '""')}"`, // Escape quotes
        t.dueDate,
        t.duration,
        t.tag,
        t.createdAt,
        t.updatedAt
    ]);

    return [headers, ...rows].map(r => r.join(',')).join('\n');
}

/**
 * Export tasks as CSV file.
 */
function exportTasksCSV() {
    const csvData = tasksToCSV();
    if (!csvData) return;

    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'campusplanner.csv';
    a.click();

    URL.revokeObjectURL(url);
}

// --- ATTACH EXPORT BUTTON EVENTS ---
window.addEventListener('DOMContentLoaded', () => {
    const exportJSONBtn = document.getElementById('export-json-btn');
    const exportCSVBtn = document.getElementById('export-csv-btn');

    if (exportJSONBtn) exportJSONBtn.addEventListener('click', exportTasksJSON);
    if (exportCSVBtn) exportCSVBtn.addEventListener('click', exportTasksCSV);
});


// --- IMPORT LOGIC ---

/**
 * Handles importing tasks from a JSON file.
 * Validates the format and merges with existing tasks.
 */
function importTasksJSON(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedTasks = JSON.parse(e.target.result);

            if (!Array.isArray(importedTasks)) {
                alert("Invalid JSON format: expected an array of tasks.");
                return;
            }

            // Optional: validate required fields in each task
            const validTasks = importedTasks.filter(t =>
                t.id && t.title && t.dueDate && t.duration && t.tag
            );

            if (validTasks.length === 0) {
                alert("No valid tasks found in the imported file.");
                return;
            }

            fillMissingDurations(validTasks);

            // Merge with existing tasks and avoid duplicates by ID
            const existingIds = new Set(tasks.map(t => t.id));
            validTasks.forEach(t => {
                if (!existingIds.has(t.id)) tasks.push(t);
            });

            // Save to localStorage and render
            saveTasks();
            renderTasks();
            alert(`${validTasks.length} tasks imported successfully!`);
        } catch (err) {
            console.error(err);
            alert("Failed to parse JSON. Please check the file format.");
        }
    };

    reader.readAsText(file);
}

// --- ATTACH IMPORT BUTTON EVENTS ---
window.addEventListener('DOMContentLoaded', () => {
    const importBtn = document.getElementById('import-json-btn');
    let importInput = document.getElementById('import-json-input');

    if (importBtn && importInput) {
        importBtn.addEventListener('click', () => importInput.click());

        // Use a delegated handler that reinitializes input after each import
        importInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && (file.type === "application/json" || file.name.endsWith(".json"))) {
                importTasksJSON(file);
            } else {
                alert("Please select a valid JSON file.");
            }

            // 🔄 Fix: fully reset the input so same file can be chosen again
            const newInput = importInput.cloneNode(true);
            importInput.parentNode.replaceChild(newInput, importInput);
            importInput = newInput;

            // Reattach listener for next use
            importInput.addEventListener('change', arguments.callee);
        });
    }
});


// --- ATTACH BUTTON EVENTS ---
window.addEventListener('DOMContentLoaded', () => {
    const exportJSONBtn = document.getElementById('export-json-btn');
    const exportCSVBtn = document.getElementById('export-csv-btn');
    const importBtn = document.getElementById('import-json-btn');
    const importInput = document.getElementById('import-json-input');

    if (exportJSONBtn) exportJSONBtn.addEventListener('click', exportTasksJSON);
    if (exportCSVBtn) exportCSVBtn.addEventListener('click', exportTasksCSV);
    if (importBtn && importInput) {
        importBtn.addEventListener('click', () => importInput.click());
        importInput.addEventListener('change', e => {
            const file = e.target.files[0];
            if (file && (file.type === "application/json" || file.name.endsWith(".json"))) {
                importTasksJSON(file);
                importInput.value = ''; // reset input
            } else alert("Please select a valid JSON file.");
        });
    }
});


function validateFormFields() {
    const title = document.getElementById('title').value.trim();
    const dueDate = document.getElementById('dueDate').value.trim();
    const duration = document.getElementById('duration').value.trim();
    const tag = document.getElementById('tag').value.trim();

    const titleRegex = /^\S(?:.*\S)?$/; // no leading/trailing spaces
    const numericRegex = /^(0|[1-9]\d*)(\.\d{1,2})?$/; // duration
    const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    const tagRegex = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;
    const advancedRegex = /\b(\w+)\s+\1\b/; // catch duplicate words in title

    if (!titleRegex.test(title)) return "Title cannot have leading/trailing spaces or empty.";
    if (advancedRegex.test(title)) return "Title contains duplicated words.";
    if (!numericRegex.test(duration)) return "Duration must be a positive number (max 2 decimals).";
    if (!dateRegex.test(dueDate)) return "Date must be in YYYY-MM-DD format.";
    if (!tagRegex.test(tag)) return "Tag can only contain letters, spaces, or hyphens.";

    return null; // all good
}


function sortTasks(field, ascending = true) {
    tasks.sort((a, b) => {
        let valA = a[field];
        let valB = b[field];

        // parse numbers for duration
        if (field === 'duration') {
            valA = Number(valA);
            valB = Number(valB);
        }

        // parse dates
        if (field === 'dueDate') {
            valA = new Date(valA);
            valB = new Date(valB);
        }

        if (valA < valB) return ascending ? -1 : 1;
        if (valA > valB) return ascending ? 1 : -1;
        return 0;
    });

    renderTasks();
}

document.getElementById('task-sort').addEventListener('change', (e) => {
    const value = e.target.value;
    if (!value) return;
    const [field, order] = value.split('-');
    sortTasks(field, order === 'asc');
});



function searchTasks() {
    const pattern = document.getElementById('task-search').value;
    let regex;
    try {
        regex = new RegExp(pattern, 'i'); // case-insensitive
    } catch (e) {
        console.warn("Invalid regex", e);
        return; // skip invalid patterns
    }

    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const taskHTML = `
            <h3 class="task-title">${task.title}</h3>
            <p><strong>📅 Due:</strong> ${task.dueDate.split('T')[0]}</p>
            <p><strong>🕒 Duration:</strong> ${task.duration} mins</p>
            <p><strong>🏷️ Tag:</strong> ${task.tag}</p>
            <div class="card-actions">
                <button class="btn btn-edit" onclick="editTask('${task.id}')">Edit</button>
                <button class="btn btn-delete" onclick="showDeleteConfirmation('${task.id}')">Delete</button>
            </div>
        `;

        const card = document.createElement('div');
        card.className = 'task-card shadow-md';
        card.dataset.id = task.id;
        card.innerHTML = taskHTML;

        // Highlight matches in task title
        if (regex.test(task.title)) {
            card.querySelector('.task-title').innerHTML = task.title.replace(regex, match => `<mark>${match}</mark>`);
            taskList.appendChild(card);
        }
    });
}

// Attach search listener
document.getElementById('task-search').addEventListener('input', searchTasks);
