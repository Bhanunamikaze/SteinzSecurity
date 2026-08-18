// SteinzSecurity - shared interactions

(function () {
  // ---- Brand variables ---------------------------------------------------
  // Product names are internal working names. To rebrand a product, change
  // its suffix here - every element carrying data-name / data-mark (nav,
  // heroes, product cards, headings, footers) updates from this one place.
  // Full product name = "Steinz" + suffix. Page <title>/meta stay hardcoded.
  const BRAND = {
    company: 'Steinz Security Private Limited',
    suffixes: { dast: 'DAST', purple: 'Purple' },
  };
  document.querySelectorAll('[data-mark]').forEach((el) => {
    const s = BRAND.suffixes[el.getAttribute('data-mark')];
    if (s) el.innerHTML = 'Steinz<em>' + s + '</em>';
  });
  document.querySelectorAll('[data-name]').forEach((el) => {
    const s = BRAND.suffixes[el.getAttribute('data-name')];
    if (s) el.textContent = 'Steinz' + s;
  });
  document.querySelectorAll('[data-company]').forEach((el) => {
    el.textContent = BRAND.company;
  });

  // Nav scroll state
  const nav = document.querySelector('.nav');
  let navTick = false;
  const setNav = () => { nav.classList.toggle('scrolled', window.scrollY > 24); navTick = false; };
  const onScroll = () => { if (!navTick) { navTick = true; requestAnimationFrame(setNav); } };
  setNav();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  const btn = document.querySelector('.menu-btn');
  const links = document.querySelector('.nav-links');
  if (btn && links) {
    btn.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.textContent = open ? 'CLOSE' : 'MENU';
      if (open) nav.classList.add('scrolled');
    });
    links.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        links.classList.remove('open');
        btn.textContent = 'MENU';
      }
    });
  }

  // Scroll reveals
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    targets.forEach((el) => io.observe(el));
  }

  // Footer year
  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
