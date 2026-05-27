/**
 * Navbar — sombra reforçada após o scroll
 * Usa requestAnimationFrame para evitar disparos excessivos
 */
(function () {
  'use strict';

  var navbar = document.querySelector('.site-navbar');
  if (!navbar) return;

  var ticking = false;

  function update() {
    navbar.classList.toggle('is-scrolled', window.scrollY > 40);
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update();
})();
