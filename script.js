'use strict';

// ─── CONFIG ──────────────────────────────────────────────
const GA_ID        = 'G-NB0TR3YCE9';
const CALENDLY_URL = 'https://calendly.com/lunasgarden-de';

// ─── COOKIE CONSENT ──────────────────────────────────────
const CONSENT_KEY = 'tw_consent';

function loadGA() {
  if (document.getElementById('ga-script')) return;
  const s = document.createElement('script');
  s.id    = 'ga-script';
  s.async = true;
  s.src   = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
  s.onload = () => {
    window.gtag = window.gtag || function () { (window.dataLayer = window.dataLayer || []).push(arguments); };
    gtag('consent', 'update', { analytics_storage: 'granted' });
    gtag('config', GA_ID, { anonymize_ip: true });
  };
}

function initConsent() {
  const banner  = document.getElementById('cookie-banner');
  const accept  = document.getElementById('cookie-accept');
  const decline = document.getElementById('cookie-decline');
  const reset   = document.getElementById('cookie-settings');
  const stored  = localStorage.getItem(CONSENT_KEY);

  if (stored === 'yes') { banner?.classList.add('hidden'); loadGA(); return; }
  if (stored === 'no')  { banner?.classList.add('hidden'); return; }

  accept?.addEventListener('click', () => {
    localStorage.setItem(CONSENT_KEY, 'yes');
    banner.classList.add('hidden');
    loadGA();
  });
  decline?.addEventListener('click', () => {
    localStorage.setItem(CONSENT_KEY, 'no');
    banner.classList.add('hidden');
  });
  reset?.addEventListener('click', () => {
    localStorage.removeItem(CONSENT_KEY);
    banner?.classList.remove('hidden');
  });
}

// ─── LANGUAGE ────────────────────────────────────────────
let lang = localStorage.getItem('tw_lang') || 'de';

function applyLang(l) {
  lang = l;
  localStorage.setItem('tw_lang', l);
  document.documentElement.lang = l;

  document.querySelectorAll('[data-lang-de],[data-lang-en]').forEach(el => {
    const val = el.getAttribute('data-lang-' + l);
    if (!val) return;
    if (['H1', 'H2', 'H3', 'H4', 'P', 'BLOCKQUOTE'].includes(el.tagName)) {
      el.innerHTML = val;
    } else {
      el.textContent = val;
    }
  });

  document.querySelectorAll('[data-placeholder-de]').forEach(el => {
    const ph = el.getAttribute('data-placeholder-' + l);
    if (ph) el.placeholder = ph;
  });

  document.querySelectorAll('select option').forEach(opt => {
    const t = opt.getAttribute('data-lang-' + l);
    if (t) opt.textContent = t;
  });

  document.querySelectorAll('#toggle-lang, #toggle-lang-mobile').forEach(btn => {
    btn.textContent = l === 'de' ? 'EN' : 'DE';
  });
}

function initLang() {
  const params = new URLSearchParams(location.search);
  if (params.get('lang') === 'en') lang = 'en';
  applyLang(lang);
  document.querySelectorAll('#toggle-lang, #toggle-lang-mobile').forEach(btn => {
    btn.addEventListener('click', () => applyLang(lang === 'de' ? 'en' : 'de'));
  });
}

// ─── HEADER SCROLL ───────────────────────────────────────
function initHeaderScroll() {
  const hdr = document.getElementById('site-header');
  if (!hdr) return;
  const onScroll = () => hdr.classList.toggle('scrolled', scrollY > 60);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ─── HERO PARALLAX ───────────────────────────────────────
function initParallax() {
  const bg = document.querySelector('.hero-bg img');
  if (!bg || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  addEventListener('scroll', () => {
    if (scrollY < innerHeight) {
      bg.style.transform = `translateY(${scrollY * 0.28}px) scale(1.08)`;
    }
  }, { passive: true });
}

// ─── MOBILE MENU ─────────────────────────────────────────
function closeMobileMenu() {
  const btn  = document.getElementById('mobile-toggle');
  const menu = document.getElementById('mobile-menu');
  menu?.classList.remove('open');
  btn?.classList.remove('open');
  btn?.setAttribute('aria-expanded', 'false');
  menu?.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
window.closeMobileMenu = closeMobileMenu;

function initMobileMenu() {
  const btn  = document.getElementById('mobile-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
    menu.setAttribute('aria-hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileMenu));
}

// ═══════════════════ TESTIMONIALS GALLERY ═══════════════════
document.addEventListener('DOMContentLoaded', function() {
  const cards = document.querySelectorAll('.t-card');
  const dotsContainer = document.getElementById('t-dots');
  const prevBtn = document.getElementById('t-prev');
  const nextBtn = document.getElementById('t-next');

  if (!cards.length) return;

  let currentIndex = 0;
  const totalCards = cards.length;
  let autoSlideInterval;
  const autoSlideDelay = 5000; // 5 Sekunden

  // Erstelle Dots
  function createDots() {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalCards; i++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `t-dot ${i === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Testimonial ${i + 1} von ${totalCards}`);
      dot.addEventListener('click', () => {
        showCard(i);
        resetAutoSlide();
      });
      dotsContainer.appendChild(dot);
    }
  }

  // Zeige Karte an
  function showCard(index) {
    cards.forEach((card, idx) => {
      card.classList.remove('active');
      document.querySelectorAll('.t-dot')[idx].classList.remove('active');
    });

    cards[index].classList.add('active');
    document.querySelectorAll('.t-dot')[index].classList.add('active');
    currentIndex = index;
  }

  // Auto-Slider Funktion
  function autoSlide() {
    const nextIndex = (currentIndex + 1) % totalCards;
    showCard(nextIndex);
  }

  // Starte Auto-Slider
  function startAutoSlide() {
    autoSlideInterval = setInterval(autoSlide, autoSlideDelay);
  }

  // Stoppe Auto-Slider
  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  // Reset Auto-Slider (stoppt und startet neu)
  function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
  }

  // Next
  nextBtn.addEventListener('click', () => {
    const nextIndex = (currentIndex + 1) % totalCards;
    showCard(nextIndex);
    resetAutoSlide();
  });

  // Prev
  prevBtn.addEventListener('click', () => {
    const prevIndex = (currentIndex - 1 + totalCards) % totalCards;
    showCard(prevIndex);
    resetAutoSlide();
  });

  // Pause on Hover
  const testimonialsSection = document.getElementById('testimonials');
  if (testimonialsSection) {
    testimonialsSection.addEventListener('mouseenter', stopAutoSlide);
    testimonialsSection.addEventListener('mouseleave', startAutoSlide);
  }

  // Initialisiere
  createDots();
  showCard(0);
  startAutoSlide();
});

// ─── SCROLL REVEAL ───────────────────────────────────────
function initReveal() {
  if (!('IntersectionObserver' in window)) return;
  const els = document.querySelectorAll(
    '.angebot, .event-row, .tcard, .fw-item, .tanja-img-col, .tanja-txt, .kontakt-left, .kontakt-right, .nl-inner, .jb-content, .statement-inner'
  );
  els.forEach((el, i) => {
    el.classList.add('reveal');
    if (i % 3 === 1) el.classList.add('reveal-delay-1');
    if (i % 3 === 2) el.classList.add('reveal-delay-2');
  });
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });
  els.forEach(el => obs.observe(el));
}

// ─── SMOOTH SCROLL ───────────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({
        top: target.getBoundingClientRect().top + scrollY - 76 - 16,
        behavior: 'smooth'
      });
    });
  });
}

// ─── CALENDLY ────────────────────────────────────────────
function openCalendly() {
  if (typeof Calendly !== 'undefined') {
    Calendly.initPopupWidget({ url: CALENDLY_URL });
    return false;
  }
  window.open(CALENDLY_URL, '_blank', 'noopener');
}
window.openCalendly = openCalendly;

// ─── INIT ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initConsent();
  initLang();
  initHeaderScroll();
  initParallax();
  initMobileMenu();
  initReveal();
  initSmoothScroll();
});
