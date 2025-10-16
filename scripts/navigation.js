export class NavigationManager {
    constructor() {
        this.sections = document.querySelectorAll('.page-section');
        this.navItems = document.querySelectorAll('.nav-item');
    }

    initNavigation() {
        this.navItems.forEach(item => {
            item.addEventListener('click', () => {
                const pageId = item.dataset.page;
                this.showPage(pageId);
                history.replaceState(null, '', `#${pageId}`);
            });
        });

        const initial = window.location.hash.substring(1) || 'dashboard';
        this.showPage(initial);
    }

    showPage(pageId) {
        this.sections.forEach(section => section.classList.remove('active'));
        this.navItems.forEach(item => item.classList.remove('active'));

        const activeSection = document.getElementById(pageId);
        const activeNav = document.querySelector(`[data-page="${pageId}"]`);

        if (activeSection) activeSection.classList.add('active');
        if (activeNav) activeNav.classList.add('active');
    }
}
