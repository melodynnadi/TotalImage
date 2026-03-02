/**
 * Total Image — Main JavaScript
 * Handles: mobile navigation, FAQ accordion, form submission (mailto)
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ===================================================================
   * MOBILE NAVIGATION TOGGLE
   * =================================================================== */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('nav__links--open');
      navToggle.classList.toggle('nav__hamburger--open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile nav when a link is clicked
    navLinks.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('nav__links--open');
        navToggle.classList.remove('nav__hamburger--open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }


  /* ===================================================================
   * FAQ ACCORDION
   * =================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('faq-item--open');

      // Close all others
      faqItems.forEach(other => {
        other.classList.remove('faq-item--open');
        const otherBtn = other.querySelector('.faq-question');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('faq-item--open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });


  /* ===================================================================
   * FORM HANDLING — compose mailto links
   * Sends form data as an email to totalimagebranding@gmail.com
   * =================================================================== */
  const COMPANY_EMAIL = 'totalimagebranding@gmail.com';

  // ---- Quote Form ----
  const quoteForm    = document.getElementById('quoteForm');
  const quoteSuccess = document.getElementById('quoteSuccess');

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic validation
      if (!quoteForm.checkValidity()) {
        quoteForm.reportValidity();
        return;
      }

      const name     = document.getElementById('quoteName').value.trim();
      const email    = document.getElementById('quoteEmail').value.trim();
      const business = document.getElementById('quoteBusiness').value.trim();
      const services = document.getElementById('quoteServices').value.trim();
      if (!services) { alert('Please describe the service(s) you need.'); return; }
      const timeline = document.getElementById('quoteTimeline').value.trim();
      const details  = document.getElementById('quoteDetails').value.trim();

      const subject = encodeURIComponent(`Quote Request — ${business}`);
      const body    = encodeURIComponent(
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Business: ${business}\n` +
        `Desired Service(s): ${services}\n` +
        `Timeline: ${timeline || 'Not specified'}\n` +
        `\nAdditional Details:\n${details || 'None'}`
      );

      // Open default mail client
      window.location.href = `mailto:${COMPANY_EMAIL}?subject=${subject}&body=${body}`;

      // Show success state
      quoteForm.style.display = 'none';
      if (quoteSuccess) quoteSuccess.classList.add('show');
    });
  }

  // ---- Consultation Form ----
  const consultForm    = document.getElementById('consultForm');
  const consultSuccess = document.getElementById('consultSuccess');

  if (consultForm) {
    consultForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!consultForm.checkValidity()) {
        consultForm.reportValidity();
        return;
      }

      const name      = document.getElementById('consultName').value.trim();
      const email     = document.getElementById('consultEmail').value.trim();
      const business  = document.getElementById('consultBusiness').value.trim();
      const questions = document.getElementById('consultQuestions').value.trim();

      const subject = encodeURIComponent(`Free Consultation Request — ${business}`);
      const body    = encodeURIComponent(
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Business: ${business}\n` +
        `\nQuestions:\n${questions}`
      );

      window.location.href = `mailto:${COMPANY_EMAIL}?subject=${subject}&body=${body}`;

      consultForm.style.display = 'none';
      if (consultSuccess) consultSuccess.classList.add('show');
    });
  }


  /* ===================================================================
   * SMOOTH SCROLL TO HASH ON PAGE LOAD
   * (for links like get-started.html#consultation)
   * =================================================================== */
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }

  // ---- Animations ----
  initNavShadow();
  initScrollReveal();
  initButtonRipple();

});

/* ===================================================================
 * NAV SHADOW ON SCROLL
 * =================================================================== */
function initNavShadow() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const update = () => nav.classList.toggle('nav--scrolled', window.scrollY > 20);
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ===================================================================
 * SCROLL REVEAL  (IntersectionObserver)
 * =================================================================== */
function initScrollReveal() {
  // Selectors whose items stagger within their parent group
  const staggerSelectors = [
    '.service-item',
    '.home-service-card',
    '.faq-item',
    '.form-card',
    '.hero__stat',
  ];

  staggerSelectors.forEach(sel => {
    // Group by direct parent so stagger resets per grid/list
    const parents = new Map();
    document.querySelectorAll(sel).forEach(el => {
      if (el.hasAttribute('data-reveal')) return;
      const p = el.parentElement;
      if (!parents.has(p)) parents.set(p, []);
      parents.get(p).push(el);
    });
    parents.forEach(siblings => {
      siblings.forEach((el, i) => {
        el.setAttribute('data-reveal', 'up');
        if (i > 0) el.style.setProperty('--reveal-delay', `${i * 90}ms`);
      });
    });
  });

  // Single-element reveals
  [
    '.section-header',
    '.home-cta__inner',
    '.quote-cta',
  ].forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      if (!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', 'up');
    });
  });

  // About grid: left + right slide
  const aboutCols = document.querySelectorAll('.about-grid > *');
  if (aboutCols.length >= 2) {
    aboutCols[0].setAttribute('data-reveal', 'left');
    aboutCols[1].setAttribute('data-reveal', 'right');
  }

  // Observe everything tagged
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
}

/* ===================================================================
 * BUTTON RIPPLE
 * =================================================================== */
function initButtonRipple() {
  document.querySelectorAll('.btn').forEach(btn => {
    // Ensure btn can clip the ripple
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';

    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement('span');
      ripple.style.cssText = [
        'position:absolute',
        `width:${size}px`,
        `height:${size}px`,
        'border-radius:50%',
        'background:rgba(255,255,255,0.28)',
        `left:${e.clientX - rect.left - size / 2}px`,
        `top:${e.clientY - rect.top - size / 2}px`,
        'transform:scale(0)',
        'animation:ripple 0.55s linear',
        'pointer-events:none',
      ].join(';');
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
}
