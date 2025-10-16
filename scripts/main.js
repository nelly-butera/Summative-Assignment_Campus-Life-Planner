// =========================
// main.js
// =========================

const menuToggle = document.getElementById('menu-toggle');
const navbar = document.getElementById('navbar');
const themeToggle = document.getElementById('theme-toggle');

// Collapsible menu
menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!expanded));
  navbar.classList.toggle('open');
});

// Theme toggle
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});


// scripts/main.js

document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".page-section");

  // Function to show a specific section
  function showSection(id) {
    sections.forEach(section => {
      section.classList.toggle("active", section.id === id);
    });

    navLinks.forEach(link => {
      const isActive = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("active", isActive);
    });

    // Update URL hash without scrolling
    history.pushState(null, "", `#${id}`);
  }

  // Click handling
  navLinks.forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      const targetId = link.getAttribute("href").substring(1);
      showSection(targetId);
    });
  });

  // On page load, show the section in the hash or default to "about"
  const currentHash = window.location.hash.substring(1) || "about";
  showSection(currentHash);
});


