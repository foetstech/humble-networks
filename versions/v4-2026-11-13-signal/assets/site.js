/* humble-networks-site-v4 | assets/site.js | created 2026-11-13 02:25 UTC (04:25 SAST). Reason: menu, reveals, header signal meter and the signal guide robot that walks down the page. Replace this line when you change this file. */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var targets = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var reveal = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          reveal.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    targets.forEach(function (el) { reveal.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add('in'); });
  }

  var signal = document.querySelector('.signal');
  var bars = document.querySelectorAll('.signal i');
  var cap = document.querySelector('.signal-cap');
  var captions = ['', 'Signal building', 'Getting stronger', 'Strong signal', 'Full signal'];
  var guide = document.querySelector('.guide');
  var say = document.querySelector('.guide-say');
  var sections = document.querySelectorAll('main > section[data-say]');
  var lastLevel = -1;
  var current = -1;

  var update = function () {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 1;
    var level = p >= 0.98 ? 4 : Math.max(1, Math.ceil(p * 4));
    if (signal && level !== lastLevel) {
      lastLevel = level;
      bars.forEach(function (b, i) { b.classList.toggle('on', i < level); });
      signal.setAttribute('data-level', String(level));
      if (cap) { cap.textContent = captions[level]; }
    }
    if (guide && !reduce) {
      guide.style.top = (12 + p * 72) + 'vh';
    }
    if (guide && sections.length) {
      var mid = window.innerHeight / 2;
      var idx = -1;
      sections.forEach(function (s, i) {
        var r = s.getBoundingClientRect();
        if (r.top <= mid && r.bottom > mid) { idx = i; }
      });
      if (idx !== -1 && idx !== current) {
        current = idx;
        if (say) { say.textContent = sections[idx].getAttribute('data-say'); }
        guide.classList.remove('point');
        void guide.offsetWidth;
        if (!reduce) { guide.classList.add('point'); }
      }
    }
  };

  var queued = false;
  var onScroll = function () {
    if (!queued) {
      queued = true;
      window.requestAnimationFrame(function () { queued = false; update(); });
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
