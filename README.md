### 🎓 Campus Life Planner

Hello Welcome To My Campus Life Planner app!!

My project Video Link: https://youtu.be/mLI_aDgm7Bk

My Github Pages Deployment: https://nelly-butera.github.io/Summative-Assignment_Campus-Life-Planner/

### 📋 Project Overview

**Theme:** Campus Life Planner  
**Assignment:** Summative – Building Responsive UI  
**Tech Stack:** HTML, CSS, JavaScript (ES Modules), LocalStorage  

This planner helps students manage their schedules efficiently by tracking task durations, tags, and due dates. It supports regex-powered search, live task updates, light/dark themes, and persistent data storage.


### 🧩 Features

- 🗓️ Add, edit, and delete tasks/events  
- ⏰ Auto-calculated duration between start and end times  
- 🔍 Live **regex search** with match highlighting  
- 💾 LocalStorage persistence  
- 📤 Import / Export tasks (JSON & CSV)  
- 🌗 Theme toggle (Light / Dark)  
- 📱 Fully responsive (mobile-first)  
- ♿ Accessible keyboard navigation + ARIA live messages  


### 🧠 Regex Catalog

| Field | Purpose | Pattern |
|-------|----------|----------|
| **Title** | Forbid leading/trailing spaces | `^\S(?:.*\S)?$` |
| **Duration (minutes/hours)** | Positive integers | `^(0|[1-9]\d*)(\.\d{1,2})?$` |
| **Due Date** | YYYY-MM-DD format | `^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$` |
| **Tag** | Words with spaces/hyphens | `^[A-Za-z]+(?:[ -][A-Za-z]+)*$` |
| **Advanced** | Detect duplicate words | `\b(\w+)\s+\1\b` |


### 🧱 File Structure

```bash

CampusLifePlanner/
│
├── index.html # Main HTML file
│
├── styles/
│ ├── main.css # Global styles
│ └── responsive.css # Breakpoints & media queries
│
├── scripts/
│ ├── app.js # Main app controller
│ ├── ui.js # UI rendering & messages
│ ├── state.js # State management (CRUD)
│ ├── storage.js # LocalStorage + import/export
│ ├── search.js # Regex search & highlighting
│ ├── validation.js # Regex-based input validation
│ └── form.js # Time picker + duration logic
│
├── assets/
│ ├── icons/ # SVGs and UI assets
│ └── seed.json # Sample data (10+ records)
│
├── tests.html # Small page for regex/unit tests
└── README.md

```

### 🖥️ How to Run

1. Clone or download this repository  
2. Open `index.html` in your browser  
3. Add tasks and explore features  
4. Your data is saved automatically in `localStorage`  

To reset or import new data:
- Use the “Settings” → *Import/Export* section



### 🎯 Accessibility & UX

- Semantic HTML landmarks (`<header>`, `<main>`, `<section>`, `<footer>`)  
- Visible keyboard focus indicators  
- ARIA live region for notifications (`role="status"`)  
- High contrast mode and responsive typography  
- All features are keyboard-accessible (Tab/Enter navigation)  


### ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **Tab / Shift+Tab** | Navigate through inputs & buttons |
| **Enter** | Submit form |
| **Esc** | Close modals / reset form |
| **Alt + T** | Toggle theme |



### 📊 Dashboard Stats

- Total tasks  
- Average duration  
- Top tag by frequency  
- 7-day trend (simple JS chart)  
- “Cap” or target duration with ARIA feedback when exceeded  



### 📦 Persistence & Data

All data is automatically saved in your browser’s `localStorage`.

You can:
- **Export JSON/CSV:** for backup or sharing  
- **Import JSON:** to load saved tasks  
- Data is validated before import to prevent corruption  


### 🧪 Testing

`tests.html` includes small regex & feature tests:
- Validates title, tag, and date formats  
- Tests regex search safety (`try/catch` handling)
- Checks duration conversions and form validation  



### 📞 About

**Developer:** Teta Butera Nelly   
**GitHub:** [https://github.com/nelly-butera]  

> “Organize smarter, not harder — your time is your campus currency.”


### 🧾 License

This project is open-source under the MIT License.