# 🏫 Campus Life Planner  
**Milestone 1 – Spec & Wireframes**  
*(Building Responsive UI Summative Assignment)*  

---

## 🎯 Purpose Statement

The **Campus Life Planner** is a responsive, accessible web application that helps students manage and organize campus-related tasks and events.  
It allows users to add, edit, and track their academic and extracurricular activities, monitor total durations, and view summaries or trends — all stored locally for persistence.  

The app demonstrates responsive design, modular JavaScript, regex validation and search, accessibility best practices, and data persistence using `localStorage`.

---

## 🧩 Data Model

Each record represents a campus task or event.

```json
{
  "id": "task_001",
  "title": "Group Study Session",
  "dueDate": "2025-10-20",
  "duration": 120,
  "tag": "Study",
  "createdAt": "2025-10-16T09:00:00Z",
  "updatedAt": "2025-10-16T09:00:00Z"
}
```

### Field Descriptions

| Field | Type | Description | Regex Validation |
|--------|------|--------------|------------------|
| `id` | string | Auto-generated unique identifier | n/a |
| `title` | string | Task or event title | `/^\S(?:.*\S)?$/` |
| `dueDate` | string (YYYY-MM-DD) | Date of the event/task | `/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/` |
| `duration` | number | Duration in minutes or hours | `/^(0|[1-9]\d*)(\.\d{1,2})?$/` |
| `tag` | string | Category or label (e.g., “Study”, “Sports”) | `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/` |
| `createdAt` | string | ISO timestamp of creation | n/a |
| `updatedAt` | string | ISO timestamp of last update | n/a |

### Advanced Regex Ideas
- Detect time tokens in text → `/\b\d{2}:\d{2}\b/`
- Filter by tag prefix → `/^@tag:\w+/`

---

## 📑 Pages & Navigation Structure

| Page | Purpose | Key Elements |
|------|----------|--------------|
| **1. About** | Introduce the app and developer | Purpose statement, contact info (GitHub/email) |
| **2. Dashboard/Stats** | Visual summary of user data | Total tasks, total duration, top tag, cap/target progress, trend chart |
| **3. Records (Main Page)** | Display and manage all tasks/events | Sortable/searchable table or cards with edit/delete options |
| **4. Add/Edit Form** | Create or modify tasks | Input fields (title, dueDate, duration, tag) with live regex validation |
| **5. Settings** | Manage preferences | Units (minutes ↔ hours), cap target, JSON import/export buttons |

---

## ♿ Accessibility Plan (a11y)

| Feature | Description |
|----------|--------------|
| **Semantic Structure** | Use landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`) |
| **Labels & Inputs** | Every input has an associated `<label>` |
| **Keyboard Navigation** | Full tab order and Enter/Space actions |
| **Skip to Content Link** | Enables quick navigation for keyboard/screen reader users |
| **Visible Focus Styles** | Clear focus indicators for all interactive elements |
| **ARIA Live Regions** | Announce form errors and dashboard updates |
| **Color Contrast** | Meet WCAG AA standards for readability |

---

## 📱 Responsive Design Plan

| Breakpoint | Layout Description |
|-------------|--------------------|
| **Mobile (≤ 480px)** | Single-column layout; stacked cards instead of table |
| **Tablet (481–768px)** | Two-column layout; responsive grid for stats |
| **Desktop (≥ 1024px)** | Table layout with side stats panel and header navigation |
| **Animation/Transition** | Smooth fade and slide transitions on hover or form toggles |

**Techniques:**  
- Mobile-first CSS design  
- Flexbox and media queries  
- Consistent spacing, alignment, and typography  

---

## ⚙️ Core Features Summary

| Feature | Description |
|----------|--------------|
| **Add/Edit/Delete Tasks** | CRUD operations with inline editing and confirmation dialogs |
| **Regex Validation** | ≥4 regex rules (title, date, duration, tag + 1 advanced) |
| **Regex Search** | Live search with safe regex compiler and `<mark>` highlights |
| **Sorting** | Sort tasks by title, dueDate, or duration |
| **Stats Dashboard** | Total records, total duration, top tag, cap logic, ARIA updates |
| **Persistence** | Auto-save to `localStorage`, JSON import/export with validation |
| **Accessibility** | Keyboard flow, ARIA roles, semantic HTML |
| **Responsive UI** | 3 breakpoints, polished transitions |
| **Settings Page** | Manage unit conversions and targets |

---

## 🖼️ Wireframes

### 1️⃣ About Page
```
+----------------------------------------------------+
| Campus Life Planner                                |
|----------------------------------------------------|
| Plan and track your campus events with ease.       |
| Contact: GitHub | Email                            |
+----------------------------------------------------+
```

---

### 2️⃣ Dashboard / Stats
```
[Dashboard Summary]
-----------------------------------------
Total Tasks: 12
Total Duration: 48 hrs
Top Tag: Study
Cap: 60 hrs | Remaining: 12 hrs (✓ within target)

[7-Day Trend Chart – simple bars]
Mon ▇▇▇▇▇▇▇▇▇
Tue ▇▇▇▇▇▇
...
```

---

### 3️⃣ Records (Main Page)
```
[Search Bar: /regex here/   (Case-insensitive toggle)]
-----------------------------------------------------
| Title              | Due Date   | Duration | Tag   | Actions  |
-----------------------------------------------------
| Group Study        | 2025-10-20 | 2 hrs    | Study | Edit | 🗑 |
| Club Meeting       | 2025-10-21 | 1.5 hrs  | Club  | Edit | 🗑 |
-----------------------------------------------------
[+ Add New Task Button]
```

---

### 4️⃣ Add/Edit Form
```
Add a New Task
------------------------------
Title: [__________]
Due Date: [YYYY-MM-DD]
Duration: [_____] (minutes)
Tag: [__________]
[Save Task] [Cancel]

Validation messages appear inline.
```

---

### 5️⃣ Settings Page
```
Settings
------------------------------
Units: [Minutes | Hours]
Cap Target: [60 hrs]
Import JSON [Button]
Export JSON [Button]
```

---

## 🧮 Milestone 1 Deliverables Checklist

- [x] Purpose statement and chosen theme  
- [x] Data model defined with field validation patterns  
- [x] Pages and navigation structure described  
- [x] Accessibility plan completed  
- [x] Responsive design plan included  
- [x] Core features summarized  
- [x] Wireframes created (text-based layout sketches)  

---

**Author:** Teta Butera Nelly  

---
