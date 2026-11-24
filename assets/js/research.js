const publicationLists = document.querySelectorAll('[data-papers]');

for (const list of publicationLists) {
  const filters = list.querySelector('[data-filters]');
  const area = list.querySelector('[data-area]');
  const year = list.querySelector('[data-year]');
  const count = list.querySelector('[data-count]');
  const cards = [...list.querySelectorAll('.paper-card')];

  function applyFilters() {
    let shown = 0;

    for (const card of cards) {
      const matchesArea = !area.value || area.value === card.dataset.paperArea;
      const matchesYear = !year.value || year.value === card.dataset.paperYear;
      card.hidden = !matchesArea || !matchesYear;
      if (!card.hidden) shown += 1;
    }

    count.textContent = shown === 0
      ? 'No papers match these filters.'
      : `Showing ${shown} of ${cards.length} papers`;
  }

  filters.addEventListener('change', applyFilters);
  window.addEventListener('pageshow', applyFilters);
  applyFilters();
  filters.hidden = false;
}

const updatesPanel = document.querySelector('.updates-scroll');
const seventhUpdate = updatesPanel?.querySelector('.timeline > li:nth-child(7)');

if (seventhUpdate) {
  const timeline = seventhUpdate.parentElement;
  const fitUpdates = () => {
    const height = seventhUpdate.getBoundingClientRect().bottom - timeline.getBoundingClientRect().top;
    updatesPanel.style.setProperty('--updates-height', `${Math.ceil(height) + 2}px`);
  };

  fitUpdates();
  new ResizeObserver(fitUpdates).observe(timeline);
}

const header = document.querySelector('.site-header');
const sectionLinks = [...header.querySelectorAll('.site-nav a[href^="#"]')];
const sections = sectionLinks.map(link => document.getElementById(link.hash.slice(1)));

if (sections.length) {
  let activeLink = sectionLinks[0];

  function updateCurrentSection() {
    const threshold = header.offsetHeight + 32;
    let currentSection = 0;

    for (const [index, section] of sections.entries()) {
      if (section.getBoundingClientRect().top <= threshold) currentSection = index;
    }

    const nextLink = sectionLinks[currentSection];
    if (nextLink === activeLink) return;

    activeLink.removeAttribute('aria-current');
    nextLink.setAttribute('aria-current', 'location');
    activeLink = nextLink;
  }

  window.addEventListener('scroll', updateCurrentSection, { passive: true });
  window.addEventListener('resize', updateCurrentSection);
  window.addEventListener('load', updateCurrentSection);
  updateCurrentSection();
}
