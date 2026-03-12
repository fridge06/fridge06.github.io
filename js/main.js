// =====================
// SECTION LOADER
// Fetches each HTML section file and injects it into the page.
// This is how real sites dynamically load content.
// =====================

async function loadSection(file, targetId) {
  try {
    const response = await fetch(file);
    if (!response.ok) throw new Error(`Could not load ${file}`);
    const html = await response.text();
    document.getElementById(targetId).innerHTML = html;
  } catch (err) {
    console.error(err);
  }
}

// Load all sections, then kick off the rest of the scripts
async function init() {
  await Promise.all([
    loadSection('sections/about.html',     'load-about'),
    loadSection('sections/projects.html',  'load-projects'),
    loadSection('sections/education.html', 'load-education'),
    loadSection('sections/contact.html',   'load-contact'),
  ]);

  // These run AFTER sections are in the DOM
  setYear();
  initScrollReveal();
  initActiveNav();
}

// =====================
// YEAR
// =====================
function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

// =====================
// SCROLL REVEAL
// Watches each .reveal element; adds .visible when it enters the viewport.
// =====================
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => observer.observe(el));
}

// =====================
// ACTIVE NAV HIGHLIGHT
// Highlights the nav link for whichever section is in view.
// =====================
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = link.getAttribute('href') === `#${entry.target.id}`
            ? 'var(--ink)' : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
}

// =====================
// KICK IT OFF
// =====================
init();
