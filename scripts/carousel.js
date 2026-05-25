/**
 * Carrossel Diferencial — 7 slides com autoplay e animação slide-in left
 *
 * Configuração:
 * - 7 slides com label + texto (e opcionalmente uma imagem de fundo)
 * - Autoplay a cada 3 segundos
 * - Pause ao passar o mouse (mouseenter/mouseleave)
 * - Pause quando a aba do navegador fica inativa (visibilitychange)
 * - Clique nos dots reinicia o timer
 * - Animação CSS @keyframes slideInLeft dispara a cada troca
 */
(function () {
  'use strict';

  var AUTOPLAY_INTERVAL = 3000; // 3 segundos

  // Dados dos slides
  // Para adicionar imagem real, preencher o campo `image`:
  //   { label: 'RIs', text: '...', image: 'imgs/diferencial-ri.jpg' }
  var slides = [
    {
      label: 'RIs',
      text: 'É o departamento (ou função) responsável por gerenciar o fluxo de informações entre a companhia e a comunidade financeira. O objetivo é garantir que a empresa seja avaliada de forma justa pelo mercado através da transparência e do cumprimento de normas regulatórias.',
      image: 'https://www.astri.solutions/campanhas/rede-estrategica-talentos/imagens/diferenciais/ris-min.jpg'
    },
    {
      label: 'CFOs',
      text: 'Profissionais responsáveis pela estratégia financeira da companhia, com profundo conhecimento de governança, riscos e relacionamento com investidores.',
      image: 'https://www.astri.solutions/campanhas/rede-estrategica-talentos/imagens/diferenciais/cfo-min.jpg'
    },
    {
      label: 'CEOs',
      text: 'Liderança executiva que precisa equilibrar a comunicação estratégica com o mercado de capitais e a operação da companhia.',
      image: 'https://www.astri.solutions/campanhas/rede-estrategica-talentos/imagens/diferenciais/ceo-min.jpg'
    },
    {
      label: 'Conselheiros',
      text: 'Profissionais experientes que contribuem para a governança corporativa e a tomada de decisões estratégicas das companhias abertas.',
      image: 'https://www.astri.solutions/campanhas/rede-estrategica-talentos/imagens/diferenciais/conselheiros-min.jpg'
    },
    {
      label: 'Investidores',
      text: 'Fundos, gestoras e investidores institucionais que demandam transparência, qualidade de comunicação e profissionais de RI bem preparados.',
      image: 'https://www.astri.solutions/campanhas/rede-estrategica-talentos/imagens/diferenciais/investidores-institucionais-min.jpg'
    },
    {
      label: 'Analistas',
      text: 'Profissionais que avaliam companhias abertas e dependem de RI estruturado para entregar análises consistentes ao mercado.',
      image: 'https://www.astri.solutions/campanhas/rede-estrategica-talentos/imagens/diferenciais/analistas-min.jpg'
    },
    {
      label: 'Companhias Abertas',
      text: 'Empresas listadas em bolsa que dependem de áreas de RI maduras para sustentar transparência, governança e relacionamento com o mercado.',
      image: 'https://www.astri.solutions/campanhas/rede-estrategica-talentos/imagens/diferenciais/companhias-abertas-min.jpg'
    }
  ];

  var carousel        = document.querySelector('.diferencial-carousel');
  var slidesContainer = document.querySelector('.diferencial-slides');
  var mainSlide       = document.querySelector('.diferencial-slide-main');
  var labelEl         = document.querySelector('[data-slide-label]');
  var textEl          = document.querySelector('[data-slide-text]');
  var sideEls         = document.querySelectorAll('.diferencial-slide-side');
  var dots            = document.querySelectorAll('.diferencial-dot');

  if (!slidesContainer || !dots.length) return;

  var currentSlide = 0;
  var autoplayTimer = null;

  function setSideBackground(el, slide) {
    el.style.backgroundImage = slide.image ? 'url(\'' + slide.image + '\')' : 'none';
  }

  function triggerSlideAnimation() {
    var targets = [mainSlide, sideEls[0], sideEls[1]].filter(Boolean);
    targets.forEach(function (el) { el.classList.remove('is-animating'); });
    // força reflow para reiniciar a animação CSS
    void document.body.offsetWidth;
    targets.forEach(function (el) { el.classList.add('is-animating'); });
  }

  function updateSlide(index) {
    currentSlide = (index + slides.length) % slides.length;
    var slide = slides[currentSlide];
    var prev  = slides[(currentSlide - 1 + slides.length) % slides.length];
    var next  = slides[(currentSlide + 1) % slides.length];

    if (labelEl) labelEl.textContent = slide.label;
    if (textEl)  textEl.textContent  = slide.text;

    if (mainSlide) {
      mainSlide.style.backgroundImage = slide.image ? 'url(\'' + slide.image + '\')' : 'none';
    }

    if (sideEls[0]) {
      sideEls[0].dataset.label = prev.label;
      setSideBackground(sideEls[0], prev);
    }
    if (sideEls[1]) {
      sideEls[1].dataset.label = next.label;
      setSideBackground(sideEls[1], next);
    }

    dots.forEach(function (d, i) {
      d.classList.toggle('active', i === currentSlide);
    });

    triggerSlideAnimation();
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(function () {
      updateSlide(currentSlide + 1);
    }, AUTOPLAY_INTERVAL);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  // Clique em dot reinicia o timer
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      updateSlide(i);
      startAutoplay();
    });
  });

  // Pause em hover
  if (carousel) {
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
  }

  // Pause em aba inativa
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stopAutoplay();
    else startAutoplay();
  });

  updateSlide(0);
  startAutoplay();
})();
