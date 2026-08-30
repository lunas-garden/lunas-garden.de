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

  // Uebersetzter FAQ-Text ist unterschiedlich lang -> offene Panels nachmessen
  document.querySelectorAll('.faq-item.open .faq-a').forEach(panel => {
    panel.style.maxHeight = panel.scrollHeight + 'px';
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
  // Bewusst NICHT dabei: .faq-item und .ll-price. Beide enthalten Bedienelemente
  // (Akkordeon-Button, Kauf-CTA). Loest der IntersectionObserver dort aus
  // irgendeinem Grund nicht aus, bliebe ein Conversion-Element unsichtbar.
  const els = document.querySelectorAll(
    '.angebot, .event-row, .fab-card, .fw-item, .ll-text, .tanja-img-col, .tanja-txt, .kontakt-left, .kontakt-right, .nl-inner, .jb-content, .statement-inner'
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

  // Sicherheitsnetz: Was nach 4 s immer noch nicht aufgedeckt wurde, wird
  // sichtbar geschaltet. Lieber ohne Animation als unsichtbarer Inhalt.
  setTimeout(() => {
    els.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0) el.classList.add('visible');
    });
  }, 4000);
}

// ─── SMOOTH SCROLL ───────────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
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
function trackCta(source, label) {
  if (typeof window.gtag !== 'function') return;
  gtag('event', 'cta_click', { cta_source: source || 'unbekannt', cta_label: label || '' });
}
window.trackCta = trackCta;

function openCalendly(source) {
  trackCta(source, 'calendly');
  if (typeof Calendly !== 'undefined') {
    Calendly.initPopupWidget({ url: CALENDLY_URL });
    return false;
  }
  window.open(CALENDLY_URL, '_blank', 'noopener');
}
window.openCalendly = openCalendly;

// ─── FAQ-AKKORDEON ───────────────────────────────────────
function initFaq() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    const panel = item.querySelector('.faq-a');
    if (!btn || !panel) return;
    btn.addEventListener('click', () => {
      const open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
      panel.style.maxHeight = open ? panel.scrollHeight + 'px' : '0px';
      if (open) trackCta('faq', btn.textContent.trim().replace(/\+$/, '').trim());
    });
  });
  // Bei Sprachwechsel/Resize kann sich die Hoehe aendern
  addEventListener('resize', () => {
    document.querySelectorAll('.faq-item.open .faq-a').forEach(p => {
      p.style.maxHeight = p.scrollHeight + 'px';
    });
  }, { passive: true });
}

// ─── STICKY CTA (Mobile) ─────────────────────────────────
function initStickyCta() {
  const bar = document.getElementById('sticky-cta');
  const hero = document.getElementById('hero');
  const kontakt = document.getElementById('kontakt');
  if (!bar || !hero) return;
  const update = () => {
    const pastHero = scrollY > hero.offsetHeight * 0.85;
    // Im Kontaktbereich waere die Leiste redundant und verdeckt das Formular
    const inContact = kontakt && kontakt.getBoundingClientRect().top < innerHeight * 0.9;
    bar.classList.toggle('visible', pastHero && !inContact);
  };
  addEventListener('scroll', update, { passive: true });
  update();
}

// ─── KONTAKTFORMULAR: senden ohne Seitenwechsel ──────────
const FORM_TEXT = {
  de: {
    sending: 'Wird gesendet …',
    ok: 'Danke – deine Nachricht ist bei Tanja angekommen. Sie meldet sich in der Regel innerhalb von zwei Werktagen.',
    err: 'Das hat leider nicht geklappt. Schreib mir gern direkt auf Instagram – oder versuch es in einem Moment noch einmal.'
  },
  en: {
    sending: 'Sending …',
    ok: 'Thank you – your message reached Tanja. She usually replies within two working days.',
    err: 'That did not work, unfortunately. Feel free to message me on Instagram – or try again in a moment.'
  }
};

function initContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form || !status) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const t = FORM_TEXT[lang] || FORM_TEXT.de;
    const submitBtn = form.querySelector('button[type="submit"]');

    status.hidden = false;
    status.className = 'form-status';
    status.textContent = t.sending;
    if (submitBtn) submitBtn.disabled = true;

    try {
      const data = Object.fromEntries(new FormData(form).entries());
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success) {
        status.className = 'form-status ok';
        status.textContent = t.ok;
        trackCta('kontaktformular', data.interest || 'ohne Angabe');
        form.reset();
      } else {
        throw new Error(json.message || 'submit failed');
      }
    } catch (err) {
      status.className = 'form-status err';
      status.textContent = t.err;
    } finally {
      if (submitBtn) submitBtn.disabled = false;
      status.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}

// ─── Interesse aus dem Angebots-Link vorbelegen ──────────
function initInterestPreselect() {
  const select = document.getElementById('f-interest');
  if (!select) return;
  document.querySelectorAll('[data-interest]').forEach(el => {
    el.addEventListener('click', () => {
      const val = el.getAttribute('data-interest');
      if ([...select.options].some(o => o.value === val)) select.value = val;
      trackCta('angebot-link', val);
    });
  });
}

// ─── Ausgehende Buchungslinks messen ─────────────────────
function initOutboundTracking() {
  document.querySelectorAll('a[target="_blank"][href^="http"]').forEach(a => {
    a.addEventListener('click', () => {
      let host = a.href;
      try { host = new URL(a.href).hostname; } catch (e) {}
      trackCta('outbound', host);
    });
  });
}

// ─── INIT ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initConsent();
  initLang();
  initHeaderScroll();
  initParallax();
  initMobileMenu();
  initReveal();
  initSmoothScroll();
  initFaq();
  initStickyCta();
  initContactForm();
  initInterestPreselect();
  initOutboundTracking();
});
