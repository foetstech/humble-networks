/* humble-networks-site-v2 | assets/site.js | created 2026-11-13 00:40 UTC (02:40 SAST)
   Reason: menu, scroll reveals, hero cable and video play. Replace this line when you change this file. */
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
})();
