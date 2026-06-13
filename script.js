(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function setupHeroSequence() {
    const sequenced = Array.from(document.querySelectorAll('.hero-seq'));
    if (!sequenced.length) return;

    if (reduceMotion) {
      sequenced.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const stepDelay = {
      1: 100,
      2: 300,
      3: 550,
      4: 700,
      5: 820,
      6: 940,
    };

    sequenced.forEach((el) => {
      const step = Number.parseInt(el.getAttribute('data-hero-step') || '1', 10);
      const delay = Number.isFinite(stepDelay[step]) ? stepDelay[step] : 120;
      window.setTimeout(() => {
        el.classList.add('is-visible');
      }, delay);
    });
  }

  function setupHeroTypewriter() {
    const subtitle = document.querySelector('.hero-subtitle');
    if (!subtitle) return;

    const fullText = (subtitle.textContent || '').trim();
    if (!fullText || reduceMotion) return;
    if (subtitle.dataset.typed === 'true') return;

    subtitle.dataset.typed = 'true';
    subtitle.textContent = '';

    let index = 0;
    const speed = 28;

    const typeNext = () => {
      subtitle.textContent += fullText.charAt(index);
      index += 1;
      if (index < fullText.length) {
        window.setTimeout(typeNext, speed);
      }
    };

    window.setTimeout(typeNext, 820);
  }

  function setupRevealObserver() {
    const revealItems = Array.from(document.querySelectorAll('.reveal'));
    if (!revealItems.length) return;

    if (!('IntersectionObserver' in window) || reduceMotion) {
      revealItems.forEach((item) => item.classList.add('visible'));
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  function setupCountdown() {
    const container = document.getElementById('countdown');
    const d = document.getElementById('cd-d');
    const h = document.getElementById('cd-h');
    const m = document.getElementById('cd-m');
    const s = document.getElementById('cd-s');

    if (!container || !d || !h || !m || !s) return;

    const launchTimestamp = new Date('2026-08-15T00:00:00+05:30').getTime();

    const render = () => {
      const now = Date.now();
      const diff = launchTimestamp - now;

      if (diff <= 0) {
        container.innerHTML = '<span class="cd-live">&#10022; sparq is live</span>';
        return false;
      }

      const day = Math.floor(diff / 86400000);
      const hour = Math.floor((diff % 86400000) / 3600000);
      const minute = Math.floor((diff % 3600000) / 60000);
      const second = Math.floor((diff % 60000) / 1000);

      d.textContent = String(day).padStart(2, '0');
      h.textContent = String(hour).padStart(2, '0');
      m.textContent = String(minute).padStart(2, '0');
      s.textContent = String(second).padStart(2, '0');

      return true;
    };

    const alive = render();
    if (!alive) return;

    const timer = window.setInterval(() => {
      const shouldContinue = render();
      if (!shouldContinue) {
        window.clearInterval(timer);
      }
    }, 1000);
  }

  function setupStatsCounter() {
    const counters = Array.from(document.querySelectorAll('[data-target]'));
    if (!counters.length) return;

    const animateCount = (el) => {
      const target = Number.parseFloat(el.dataset.target || '0');
      const suffix = el.dataset.suffix || '';
      const isFloat = !Number.isInteger(target);

      if (!Number.isFinite(target)) {
        el.textContent = `0${suffix}`;
        return;
      }

      const duration = 2400;
      const start = performance.now();

      const update = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;

        el.textContent = `${
          isFloat ? value.toFixed(1) : Math.floor(value).toLocaleString('en-US')
        }${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      };

      requestAnimationFrame(update);
    };

    if (!('IntersectionObserver' in window) || reduceMotion) {
      counters.forEach((el) => {
        const target = Number.parseFloat(el.dataset.target || '0');
        const suffix = el.dataset.suffix || '';
        if (!Number.isFinite(target)) {
          el.textContent = `0${suffix}`;
          return;
        }

        const output = Number.isInteger(target)
          ? Math.floor(target).toLocaleString('en-US')
          : target.toFixed(1);
        el.textContent = `${output}${suffix}`;
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCount(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.6 }
    );

    counters.forEach((el) => observer.observe(el));
  }

  function setupTimelineReveal() {
    const line = document.querySelector('.timeline-line');
    const visionSection = document.getElementById('vision');
    if (!line || !visionSection) return;

    if (!('IntersectionObserver' in window) || reduceMotion) {
      line.classList.add('visible');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          line.classList.add('visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(visionSection);
  }

  function setupCursorGlow() {
    const glow = document.querySelector('.cursor-glow');
    if (!glow) return;

    if (!finePointer || reduceMotion) {
      glow.style.display = 'none';
      return;
    }

    let targetX = -999;
    let targetY = -999;
    let ticking = false;

    const render = () => {
      glow.style.transform = `translate(${targetX - 210}px, ${targetY - 210}px)`;
      ticking = false;
    };

    document.addEventListener('mousemove', (event) => {
      targetX = event.clientX;
      targetY = event.clientY;

      if (!glow.classList.contains('active')) {
        glow.classList.add('active');
      }

      if (!ticking) {
        ticking = true;
        requestAnimationFrame(render);
      }
    });

    document.addEventListener('mouseleave', () => {
      glow.classList.remove('active');
    });
  }

  function setupCardSpotlight() {
    if (!finePointer || reduceMotion) return;

    const cards = Array.from(document.querySelectorAll('.glass-card'));
    cards.forEach((card) => {
      card.addEventListener('mousemove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        card.style.setProperty('--mx', `${x}px`);
        card.style.setProperty('--my', `${y}px`);
      });
    });
  }

  function setupWaitlistTicker() {
    const countEl = document.getElementById('wl-count');
    if (!countEl) return;

    const startValue = Number.parseInt(countEl.textContent.replace(/,/g, ''), 10);
    let count = Number.isFinite(startValue) ? startValue : 2847;

    window.setInterval(() => {
      if (Math.random() > 0.62) {
        count += Math.floor(Math.random() * 3) + 1;
        countEl.textContent = count.toLocaleString('en-US');
      }
    }, 4000);
  }

  document.addEventListener('DOMContentLoaded', () => {
    setupHeroSequence();
    setupHeroTypewriter();
    setupRevealObserver();
    setupCountdown();
    setupStatsCounter();
    setupTimelineReveal();
    setupCursorGlow();
    setupCardSpotlight();
    setupWaitlistTicker();
  });
})();

