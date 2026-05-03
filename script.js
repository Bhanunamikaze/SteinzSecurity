/* SteinzSecurity — interactions */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Sticky nav scroll state ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const menuBtn = document.querySelector('.nav__menu');
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    document.querySelectorAll('.nav__links a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const revealTargets = [
    ['.section__head', 'reveal'],
    ['.stats__grid', 'reveal-stagger'],
    ['.services__grid', 'reveal-stagger'],
    ['.pentest__grid', 'reveal-stagger'],
    ['.approach__steps', 'reveal-stagger'],
    ['.industries__grid', 'reveal-stagger'],
    ['.ai__copy', 'reveal'],
    ['.ai__viz', 'reveal'],
    ['.caps__grid', 'reveal-stagger'],
    ['.why__grid', 'reveal-stagger'],
    ['.cta__inner', 'reveal'],
    ['.stat', 'reveal'],
  ];
  revealTargets.forEach(([sel, cls]) => {
    document.querySelectorAll(sel).forEach(el => el.classList.add(cls));
  });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    document.querySelectorAll('.reveal, .reveal-stagger, .stat').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.reveal, .reveal-stagger, .stat').forEach(el => el.classList.add('is-in'));
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const formatNum = (n, decimals) => {
    if (decimals) return n.toFixed(decimals);
    return Math.round(n).toLocaleString('en-US');
  };
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const suffix = el.dataset.suffix || '';
    if (reduceMotion) {
      el.textContent = formatNum(target, decimals) + suffix;
      return;
    }
    const duration = 1800;
    const start = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const v = target * ease(t);
      el.textContent = formatNum(v, decimals) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window) {
    const io2 = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCount(e.target);
          io2.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => io2.observe(c));
  } else {
    counters.forEach(animateCount);
  }

  /* ---------- Tilt + hover spotlight on cards ---------- */
  if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      let raf = 0;
      const onMove = (e) => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        const px = (x / r.width) * 100;
        const py = (y / r.height) * 100;
        const rx = ((y / r.height) - 0.5) * -6;
        const ry = ((x / r.width) - 0.5) * 6;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          card.style.setProperty('--mx', px + '%');
          card.style.setProperty('--my', py + '%');
          card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
        });
      };
      const onLeave = () => {
        if (raf) cancelAnimationFrame(raf);
        card.style.transform = '';
      };
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
    });
  }

  /* ---------- Parallax on hero elements ---------- */
  if (!reduceMotion) {
    const parallaxEls = document.querySelectorAll('[data-parallax]');
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      parallaxEls.forEach(el => {
        const speed = parseFloat(el.dataset.parallax);
        el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
      });
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ---------- Approach scroll progress ---------- */
  const steps = document.querySelectorAll('.step');
  const progressBar = document.querySelector('.approach__progress-bar');
  const approachWrap = document.querySelector('.approach');
  if (steps.length && progressBar && approachWrap) {
    const updateProgress = () => {
      const r = approachWrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = r.height - vh * 0.6;
      const scrolled = Math.min(Math.max(-r.top + vh * 0.4, 0), total);
      const pct = total > 0 ? (scrolled / total) * 100 : 0;
      progressBar.style.width = pct + '%';

      // Active step: closest to viewport center
      let activeIdx = 0;
      let bestDist = Infinity;
      const center = vh * 0.45;
      steps.forEach((s, i) => {
        const sr = s.getBoundingClientRect();
        const c = sr.top + sr.height / 2;
        const d = Math.abs(c - center);
        if (d < bestDist) { bestDist = d; activeIdx = i; }
      });
      steps.forEach((s, i) => s.classList.toggle('is-active', i === activeIdx));
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
  }

  /* ---------- Marquee pause on hover ---------- */
  document.querySelectorAll('.marquee').forEach(m => {
    const track = m.querySelector('.marquee__track');
    if (!track) return;
    m.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
    m.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
  });

  /* ---------- Smooth-scroll for nav anchors (with offset) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

  /* ---------- Capabilities tab switching ---------- */
  const stackTabs = document.querySelectorAll('.stack__tab');
  const stackContents = document.querySelectorAll('[data-stack-content]');
  const stackTitle = document.querySelector('.stack__title');
  const stackDesc = document.querySelector('.stack__desc');
  const stackPath = document.querySelector('.stack__path');
  const stackMetrics = document.querySelector('.stack__metrics');

  const stackData = {
    detect: {
      title: '24/7 telemetry, detection & response.',
      desc: 'SIEM, XDR, and SOAR pipelines tuned with custom detections — built around your environment and your business risk.',
      path: 'stack/detect-respond',
      metrics: [['14m','MTTD'],['38m','MTTR'],['71%','auto-resp']],
    },
    offense: {
      title: 'Reproducible offense, every engagement.',
      desc: 'Adversary-grade tooling and tradecraft, mapped to MITRE ATT&CK with evidence chains your blue team can replay.',
      path: 'stack/offensive',
      metrics: [['12+','TTPs'],['0-day','research'],['100%','retest']],
    },
    cloud: {
      title: 'Cloud-native, infrastructure-secure.',
      desc: 'Multi-cloud hardening, IaC guardrails, and runtime visibility for AWS, Azure, and GCP — with policy-as-code by default.',
      path: 'stack/cloud-platform',
      metrics: [['3','clouds'],['IaC','first'],['eBPF','runtime']],
    },
    compliance: {
      title: 'Audit-ready, continuously.',
      desc: 'Evidence automation across ISO, SOC 2, NIS2, DORA, GDPR, and PCI — so you stop the night-before-the-audit scramble.',
      path: 'stack/governance-audit',
      metrics: [['10+','frameworks'],['72h','gap report'],['0','findings']],
    },
    engineering: {
      title: 'Secure engineering, AI included.',
      desc: 'Production engineering across web, platform, and AI — RAG, agents, evals, and guardrails on top of a secure SDLC.',
      path: 'stack/engineering-ai',
      metrics: [['SDL','first'],['RAG','+ evals'],['SBOM','signed']],
    },
  };

  if (stackTabs.length && stackTitle) {
    stackTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const key = tab.dataset.stack;
        stackTabs.forEach(t => {
          const active = t === tab;
          t.classList.toggle('is-active', active);
          t.setAttribute('aria-selected', String(active));
        });
        stackContents.forEach(c => {
          c.hidden = c.dataset.stackContent !== key;
          if (!c.hidden) {
            c.classList.remove('is-fade');
            void c.offsetWidth;
            c.classList.add('is-fade');
          }
        });
        const d = stackData[key];
        if (d) {
          stackTitle.textContent = d.title;
          stackDesc.textContent = d.desc;
          stackPath.textContent = d.path;
          if (stackMetrics) {
            stackMetrics.innerHTML = d.metrics
              .map(([v,l]) => `<li><b>${v}</b><span>${l}</span></li>`)
              .join('');
          }
        }
      });
    });
  }

})();
