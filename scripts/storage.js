// scripts/storage.js
export class StorageManager {
    constructor(key = 'pureJSTasks') {
        this.key = key;
    }

    loadTasks() {
        try {
            const data = localStorage.getItem(this.key);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error("Error loading tasks:", error);
            return [];
        }
    }

    saveTasks(tasks) {
        try {
            localStorage.setItem(this.key, JSON.stringify(tasks));
        } catch (error) {
            console.error("Error saving tasks:", error);
        }
    }

    clearTasks() {
        localStorage.removeItem(this.key);
    }

    exportJSON(tasks) {
        const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'campusplanner.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    exportCSV(tasks) {
        if (!tasks.length) return;
        const headers = ["ID", "Title", "DueDate", "StartTime", "EndTime", "Duration", "Tag"];
        const rows = tasks.map(t => [
            t.id,
            `"${t.title.replace(/"/g, '""')}"`,
            t.dueDate,
            t.startTime || '',
            t.endTime || '',
            t.duration,
            t.tag
        ]);
        const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'campusplanner.csv';
        a.click();
        URL.revokeObjectURL(url);
    }
}
