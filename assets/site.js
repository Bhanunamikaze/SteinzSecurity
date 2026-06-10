// SteinzSecurity — shared interactions

(function () {
  // Nav scroll state
  const nav = document.querySelector('.nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
  onScroll();
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
