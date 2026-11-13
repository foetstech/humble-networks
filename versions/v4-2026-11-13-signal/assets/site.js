/* humble-networks-site-v4 | assets/site.js | edited 2026-11-13 02:40 UTC (04:40 SAST). Reason: menu, reveals, header signal meter, signal guide robot, and the robot turns into a chatbot at the end of the page with 20 common questions. Replace this line when you change this file. */
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
  var chat = guide ? guide.querySelector('.chat') : null;
  var sections = document.querySelectorAll('main > section[data-say]');
  var lastLevel = -1;
  var current = -1;
  var isBot = false;

  var SALES = 'https://wa.me/27749574716';
  var TECH = 'https://wa.me/27793336484';

  var QA = [
    { q: 'What do you do?', a: 'We set up business networks and Wi-Fi, fix network faults, build websites, and run monthly support plans. Most of our work is for small businesses.' },
    { q: 'How much does it cost?', a: 'Every price is quoted after a site survey or a quick chat, so we can see what you actually need. We don’t publish fixed prices, and you’ll get a quote in writing before any work starts.' },
    { q: 'Do you come on site?', a: 'Yes, where a visit is needed. Plenty of faults can be started remotely first.' },
    { q: 'Can you fix my internet remotely?', a: 'Often, yes. We start remotely where we can, and visit when we need to see the equipment.' },
    { q: 'My internet is down right now. What do I do?', a: 'Message our tech team on WhatsApp straight away. Tell them what’s happening and what changed, and they’ll start from there.', link: TECH, linkLabel: 'Message tech on WhatsApp' },
    { q: 'How do I book a site survey?', a: 'Message our sales team on WhatsApp and tell them what you need. They’ll find a time that suits you.', link: SALES, linkLabel: 'Message sales on WhatsApp' },
    { q: 'What should I have ready for a survey?', a: 'A rough layout of the building, a list of what keeps stopping, and your current internet details if you have them.' },
    { q: 'Do you fix Wi-Fi dead spots?', a: 'Yes. We map the signal, then add access points or move equipment so the signal reaches where your people and customers are.' },
    { q: 'Can you install network cabling?', a: 'Yes, including structured cabling, patch panels and long cable runs between rooms.' },
    { q: 'Do you do network security?', a: 'Yes. We set up firewalls and keep guest and staff networks apart, so one device can’t reach everything.' },
    { q: 'What’s in a support plan?', a: 'Monitoring and maintenance, remote help, and priority response when something important fails.' },
    { q: 'Is the support plan monthly?', a: 'Yes, it’s a monthly plan. Message us on WhatsApp and we’ll suggest what fits your network.', link: SALES, linkLabel: 'Ask sales on WhatsApp' },
    { q: 'Do you build websites?', a: 'Yes. We build landing pages, business websites of three to four pages, and online shops.' },
    { q: 'How long does a website take?', a: 'It depends on what the site needs to do, so we’ll give you a clear timeline after we chat.' },
    { q: 'Do you build online shops?', a: 'Yes. We build a store for your products, with the pages a shopper needs to buy.' },
    { q: 'Do you help home offices too?', a: 'Yes. Most of our work is for small businesses, and we also help home offices get a stable connection for work and calls.' },
    { q: 'Which areas do you cover?', a: 'Tell us where you’re based on WhatsApp, and we’ll confirm whether we can help there.', link: SALES, linkLabel: 'Tell sales where you are' },
    { q: 'Who should I talk to?', a: 'Quotes and site surveys: our sales team. Faults and support: our tech team. Both are on WhatsApp.', link: SALES, linkLabel: 'Sales on WhatsApp', link2: TECH, linkLabel2: 'Tech on WhatsApp' },
    { q: 'Do you have an office I can visit?', a: 'We don’t publish an office address yet. Message us on WhatsApp and we’ll tell you the best way to meet.', link: SALES, linkLabel: 'Message sales on WhatsApp' },
    { q: 'Can I pay online?', a: 'Ask us on WhatsApp about payment options. We’ll confirm the details before any work starts.', link: SALES, linkLabel: 'Ask sales on WhatsApp' }
  ];

  var log = chat ? chat.querySelector('.chat-log') : null;
  var qWrap = chat ? chat.querySelector('.chat-q') : null;

  var addMsg = function (text, who) {
    if (!log) { return; }
    var d = document.createElement('div');
    d.className = 'msg ' + who;
    d.textContent = text;
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
  };
  var addLink = function (label, url) {
    if (!log) { return; }
    var a = document.createElement('a');
    a.className = 'msg bot';
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = label;
    log.appendChild(a);
    log.scrollTop = log.scrollHeight;
  };

  if (chat && log && qWrap) {
    QA.forEach(function (item) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'chat-btn';
      b.textContent = item.q;
      b.addEventListener('click', function () {
        addMsg(item.q, 'user');
        addMsg(item.a, 'bot');
        if (item.link) { addLink(item.linkLabel, item.link); }
        if (item.link2) { addLink(item.linkLabel2, item.link2); }
      });
      qWrap.appendChild(b);
    });
  }

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

    if (guide && chat) {
      var atEnd = p >= 0.98;
      if (atEnd !== isBot) {
        isBot = atEnd;
        guide.classList.toggle('bot', isBot);
      }
    }

    if (guide) {
      if (isBot || reduce) {
        guide.style.top = '';
      } else {
        guide.style.top = (12 + p * 72) + 'vh';
      }
    }

    if (guide && sections.length && !isBot) {
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
