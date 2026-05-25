/**
 * Tabs — Conecte-se (com slide horizontal) e Form (troca simples)
 */
(function () {
  'use strict';

  // -------------------------------------------------------------------
  // Conecte-se: tabs com animação de slide horizontal
  // -------------------------------------------------------------------
  var conecteGroup = document.querySelector('.conecte-tabs');
  var track = document.querySelector('.conecte-track');

  if (conecteGroup && track) {
    var conecteTabs = conecteGroup.querySelectorAll('[role="tab"]');
    var panels = track.querySelectorAll('.conecte-panel');

    // Remove hidden para slide funcionar
    panels.forEach(function (p) { p.removeAttribute('hidden'); });

    function activateConectePanel(target) {
      conecteTabs.forEach(function (t) {
        var isActive = t.dataset.target === target;
        t.classList.toggle('active', isActive);
        t.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      var index = target === 'profissional' ? 1 : 0;
      track.style.transform = 'translateX(-' + (index * 100) + '%)';
      track.dataset.current = target;

      // Re-disparar animação stagger da lista do painel ativo
      var activePanel = track.querySelectorAll('.conecte-panel')[index];
      if (activePanel) {
        var list = activePanel.querySelector('.conecte-list');
        if (list) {
          // Remove e re-aplica is-revealed para reiniciar as transitions
          list.classList.remove('is-revealed');
          // Força reflow para o browser "esquecer" o estado anterior
          void list.offsetWidth;
          list.classList.add('is-revealed');
        }
      }
    }

    conecteTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        activateConectePanel(tab.dataset.target);
      });
    });
  }

  // -------------------------------------------------------------------
  // Form: tabs com troca simples (sem slide)
  // -------------------------------------------------------------------
  document.querySelectorAll('.form-tabs').forEach(function (group) {
    var tabs = group.querySelectorAll('[role="tab"]');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
      });
    });
  });
})();
