/* humble-networks-site-v3 | assets/site.js | edited 2026-11-13 01:50 UTC (03:50 SAST)
   Reason: Ping colours follow the cartoon palette, and the home page scroll trail hops at each section. Replace this line when you change this file. */
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

  var targets = document.querySelectorAll('.reveal, .divider');
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

  var cable = document.querySelector('.hero-cable');
  var hero = document.querySelector('.hero');
  if (cable && hero && !reduce) {
    cable.style.strokeDashoffset = '1';
    var queued = false;
    var draw = function () {
      queued = false;
      var rect = hero.getBoundingClientRect();
      var span = hero.offsetHeight + window.innerHeight;
      var p = (window.innerHeight - rect.top) / span;
      p = Math.min(1, Math.max(0, p));
      cable.style.strokeDashoffset = String(1 - p);
    };
    var onScroll = function () {
      if (!queued) { queued = true; window.requestAnimationFrame(draw); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    draw();
  }

  var videos = document.querySelectorAll('video[data-play]');
  if (videos.length && 'IntersectionObserver' in window && !reduce) {
    var vidObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var v = entry.target;
        if (entry.isIntersecting) {
          var pr = v.play();
          if (pr && pr.catch) { pr.catch(function () {}); }
        } else {
          v.pause();
        }
      });
    }, { threshold: 0.35 });
    videos.forEach(function (v) { vidObs.observe(v); });
  }
  var body = document.body;
  if (body && body.hasAttribute('data-trail') && window.matchMedia('(min-width: 1400px)').matches) {
    var wrapEl = document.createElement('div');
    wrapEl.className = 'trail';
    wrapEl.setAttribute('aria-hidden', 'true');
    wrapEl.innerHTML = '<svg viewBox="0 0 80 1000" preserveAspectRatio="none"><path class="trail-path" d="M40 0 C 4 120, 76 230, 40 340 S 4 560, 40 670 S 76 880, 40 1000"/></svg><div class="trail-ping"><svg viewBox="0 0 60 60" width="56" height="56"><line x1="30" y1="4" x2="30" y2="14" stroke="#1D1B4B" stroke-width="3"/><circle cx="30" cy="4" r="4" fill="#FF4D8D" stroke="#1D1B4B" stroke-width="2"/><rect x="8" y="14" width="44" height="36" rx="10" fill="#FFD23F" stroke="#1D1B4B" stroke-width="3"/><circle cx="22" cy="31" r="4" fill="#1D1B4B"/><circle cx="38" cy="31" r="4" fill="#1D1B4B"/><path d="M22 42 Q30 46 38 42" fill="none" stroke="#1D1B4B" stroke-width="3" stroke-linecap="round"/></svg></div>';
    body.appendChild(wrapEl);
    var tPath = wrapEl.querySelector('.trail-path');
    var ping = wrapEl.querySelector('.trail-ping');
    var tLen = tPath.getTotalLength();
    var sections = document.querySelectorAll('main > section, main > .hero');
    var current = -1;
    var placePing = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      var pt = tPath.getPointAtLength(p * tLen);
      ping.style.left = (pt.x / 80 * 100) + '%';
      ping.style.top = (pt.y / 1000 * 100) + '%';
      var mid = window.innerHeight / 2;
      var idx = -1;
      sections.forEach(function (s, i) {
        var r = s.getBoundingClientRect();
        if (r.top <= mid && r.bottom > mid) { idx = i; }
      });
      if (idx !== -1 && idx !== current) {
        current = idx;
        ping.classList.remove('hop');
        void ping.offsetWidth;
        ping.classList.add('hop');
      }
    };
    if (reduce) {
      ping.style.display = 'none';
    } else {
      var pingQueued = false;
      var queuePing = function () {
        if (!pingQueued) {
          pingQueued = true;
          window.requestAnimationFrame(function () { pingQueued = false; placePing(); });
        }
      };
      window.addEventListener('scroll', queuePing, { passive: true });
      window.addEventListener('resize', queuePing);
      placePing();
    }
  }
})();
