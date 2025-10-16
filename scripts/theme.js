// scripts/theme.js
export class ThemeManager {
    constructor() {
        this.html = document.documentElement;
    }

    setupTheme() {
        const storedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = storedTheme || (prefersDark ? 'dark' : 'light');
        this.applyTheme(theme);

        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) toggleBtn.addEventListener('click', () => this.toggleTheme());
    }

    applyTheme(theme) {
        this.html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        document.getElementById('sun-icon').style.display = theme === 'dark' ? 'block' : 'none';
        document.getElementById('moon-icon').style.display = theme === 'light' ? 'block' : 'none';
    }

    toggleTheme() {
        const current = this.html.getAttribute('data-theme');
        this.applyTheme(current === 'dark' ? 'light' : 'dark');
    }
}
