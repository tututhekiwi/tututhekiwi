/* assets/main.js
   Unified, lightweight client JS for tututhekiwi.com
   - Mobile nav toggle
   - Smooth internal scrolling
   - External link hardening (noopener)
   - Lazy-load safety net
   - WebP support detection + fallback to JPG/PNG
   - Active nav highlighting
   - Optional "Back to top" button
*/

(function () {
  'use strict';

  // ---------- utilities ----------
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

  const throttle = (fn, wait = 100) => {
    let last = 0, timer;
    return function (...args) {
      const now = Date.now();
      const remaining = wait - (now - last);
      if (remaining <= 0) {
        clearTimeout(timer);
        last = now;
        fn.apply(this, args);
      } else {
        clearTimeout(timer);
        timer = setTimeout(() => {
          last = Date.now();
          fn.apply(this, args);
        }, remaining);
      }
    };
  };

  // ---------- DOM ready ----------
  on(document, 'DOMContentLoaded', () => {
    setupNavToggle();
    setupSmoothScroll();
    hardenExternalLinks();
    ensureLazyLoading();
    detectWebP();
    setupWebPFallbacks();
    highlightActiveNav();
    setupBackToTop();
  });

  // ---------- 1) Mobile nav toggle ----------
  function setupNavToggle() {
    const toggle = document.querySelector('[data-nav-toggle]');
    const nav = document.querySelector('[data-nav]');
    if (!toggle || !nav) return;

    const openClass = 'is-open';
    const aria = () => toggle.setAttribute('aria-expanded', nav.classList.contains(openClass));

    on(toggle, 'click', (e) => {
      e.preventDefault();
      nav.classList.toggle(openClass);
      aria();
    });

    // close when clicking a link (useful on mobile)
    $$('.nav a, [data-nav] a').forEach(a => {
      on(a, 'click', () => {
        nav.classList.remove(openClass);
        aria();
      });
    });
  }

  // ---------- 2) Smooth internal scrolling ----------
  function setupSmoothScroll() {
    const local = (a) => a.getAttribute('href') && a.getAttribute('href').startsWith('#');
    $$('a[href^="#"]').forEach(a => {
      if (!local(a)) return;
      on(a, 'click', (e) => {
        const id = a.getAttribute('href');
        const target = id.length > 1 ? $(id) : document.body;
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // update URL hash without jumping
          history.pushState(null, '', id);
        }
      });
    });
  }

  // ---------- 3) External link hardening ----------
  function hardenExternalLinks() {
    const host = location.host;
    $$('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      const isExternal = /^https?:\/\//i.test(href) && !href.includes(host);
      if (isExternal) {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }

  // ---------- 4) Lazy-load safety net ----------
  function ensureLazyLoading() {
    $$('img:not([loading])').forEach(img => img.setAttribute('loading', 'lazy'));
    $$('iframe:not([loading])').forEach(el => el.setAttribute('loading', 'lazy'));
    // decode images earlier for better CLS
    $$('img[loading="eager"]').forEach(img => img.decode && img.decode().catch(() => {}));
  }

  // ---------- 5) WebP support detection ----------
  function detectWebP() {
    try {
      const canvas = document.createElement('canvas');
      const supported = !!(canvas.getContext && canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0);
      document.documentElement.classList.add(supported ? 'webp' : 'no-webp');
    } catch (_) {
      document.documentElement.classList.add('no-webp');
    }
  }

  // ---------- 6) WebP -> JPG/PNG fallback on error ----------
  function setupWebPFallbacks() {
    const swapToFallback = (img) => {
      const src = img.getAttribute('src') || '';
      if (!/\.webp(\?.*)?$/i.test(src)) return;

      const jpg = src.replace(/\.webp(\?.*)?$/i, '.jpg$1');
      const png = src.replace(/\.webp(\?.*)?$/i, '.png$1');

      // try JPG first, then PNG
      const trySrc = (next) => {
        img.src = next;
        // prevent infinite loop if jpg/png also fails
        img.onerror = null;
      };

      // probe which fallback exists by optimistic swap (server returns 404 -> browser error)
      img.addEventListener('error', function onErr() {
        img.removeEventListener('error', onErr);
        trySrc(png);
      }, { once: true });

      trySrc(jpg);
    };

    $$('img').forEach(img => {
      on(img, 'error', () => swapToFallback(img));
    });
  }

  // ---------- 7) Active nav highlighting ----------
  function highlightActiveNav() {
    const path = location.pathname.replace(/\/+$/, ''); // trim trailing slash
    const candidates = [
      { href: '/', match: path === '' || path === '/' },
      { href: '/pages/about/', match: path.includes('/pages/about') },
      { href: '/pages/books/', match: path.includes('/pages/books') },
      { href: '/pages/map/', match: path.includes('/pages/map') },
      { href: '/pages/merch/', match: path.includes('/pages/merch') },
      { href: '/pages/adopt/', match: path.includes('/pages/adopt') },
      { href: '/pages/contact/', match: path.includes('/pages/contact') },
      { href: '/pages/weather/', match: path.includes('/pages/weather') }
    ];

    const active = candidates.find(c => c.match);
    if (!active) return;

    $$(`a[href="${active.href}"]`).forEach(a => a.classList.add('active'));
  }

  // ---------- 8) Back-to-top button (optional) ----------
  function setupBackToTop() {
    const btn = $('#toTop');
    if (!btn) return;

    const toggle = throttle(() => {
      if (window.scrollY > 400) btn.classList.add('show');
      else btn.classList.remove('show');
    }, 100);

    on(window, 'scroll', toggle);
    toggle();

    on(btn, 'click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

})();
