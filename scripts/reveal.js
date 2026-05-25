/**
 * Reveal on scroll — fade-in bottom suave
 * Usa IntersectionObserver para performance.
 * Aplica [data-reveal] e [data-reveal-stagger] via JS para manter HTML limpo.
 * Respeita prefers-reduced-motion.
 */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Seletores que devem ganhar reveal individual
  var revealSelectors = [
    '.floating-card',
    '.sobre-grid',
    '.conecte-tabs-wrapper',
    '.diferencial-tag-wrapper',
    '.diferencial-title',
    '.diferencial-subtitle',
    '.diferencial-carousel',
    '.diferencial-closing',
    '.form-grid',
    '.footer-top'
  ];

  revealSelectors.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el) {
      el.setAttribute('data-reveal', '');
    });
  });

  // Stagger para listas
  document.querySelectorAll('.conecte-list').forEach(function (el) {
    el.setAttribute('data-reveal-stagger', '');
  });

  // Respeita preferência de movimento reduzido
  if (prefersReducedMotion) return;

  // IntersectionObserver: dispara reveal quando elemento entra na viewport
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target); // anima só uma vez
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -80px 0px'
  });

  document.querySelectorAll('[data-reveal], [data-reveal-stagger]').forEach(function (el) {
    observer.observe(el);
  });
})();
