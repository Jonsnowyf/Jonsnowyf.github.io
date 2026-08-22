/* Shared colour-theme switcher for index.html and photography.html.
   The choice lives in localStorage under 'yw-theme', so both pages agree.
   Each page applies the saved theme in an inline <head> script (no flash);
   this file only wires up the swatches and repaints the particle canvas. */
(function () {
  var KEY = 'yw-theme';
  var THEMES = ['cream', 'blue', 'dark'];

  function current() {
    return document.documentElement.getAttribute('data-theme') || 'cream';
  }

  function ink() {
    return getComputedStyle(document.documentElement).getPropertyValue('--ink').trim() || '#17150f';
  }

  /* particles.js bakes its colours in at init, so a theme change means a
     rebuild. destroypJS() nulls the global registry, hence the reset. */
  function paintParticles() {
    if (typeof particlesJS !== 'function') return;
    if (!document.getElementById('particles')) return;

    if (window.pJSDom && window.pJSDom.length) {
      try { window.pJSDom[0].pJS.fn.vendors.destroypJS(); } catch (e) {}
    }
    window.pJSDom = [];
    var stale = document.querySelector('#particles canvas');
    if (stale) stale.remove();

    var c = ink();
    particlesJS('particles', {
      particles: {
        number: { value: 34, density: { enable: true, value_area: 1100 } },
        color: { value: c },
        shape: { type: 'circle', stroke: { width: 0, color: c } },
        opacity: { value: 0.14, random: true, anim: { enable: true, speed: 0.25, opacity_min: 0.04, sync: false } },
        size: { value: 2, random: true },
        line_linked: { enable: true, distance: 165, color: c, opacity: 0.07, width: 1 },
        move: { enable: true, speed: 0.4, direction: 'none', random: true, straight: false, out_mode: 'out', bounce: false }
      },
      interactivity: {
        detect_on: 'window',
        events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: false }, resize: true },
        modes: { grab: { distance: 130, line_linked: { opacity: 0.22 } } }
      },
      retina_detect: true
    });
  }

  function apply(name, persist) {
    if (THEMES.indexOf(name) < 0) name = 'cream';
    document.documentElement.setAttribute('data-theme', name);
    if (persist) { try { localStorage.setItem(KEY, name); } catch (e) {} }
    document.querySelectorAll('.sw').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.set === name));
    });
    paintParticles();
  }

  document.querySelectorAll('.sw').forEach(function (b) {
    b.addEventListener('click', function () { apply(b.dataset.set, true); });
  });

  /* Follow the choice if another tab (e.g. the other page) changes it. */
  window.addEventListener('storage', function (e) {
    if (e.key === KEY && e.newValue) apply(e.newValue, false);
  });

  apply(current(), false);
})();
