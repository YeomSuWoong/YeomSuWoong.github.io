/* =========================================================================
   Theme toggle · sticky nav · scroll-spy · reveal-on-scroll
   ========================================================================= */
(function () {
  'use strict';

  var root = document.documentElement;

  /* ---------------------------------------------------------------- theme */
  var toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  // Follow the OS theme until the visitor picks one explicitly.
  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  var onSchemeChange = function (e) {
    var stored = null;
    try { stored = localStorage.getItem('theme'); } catch (err) {}
    if (!stored) root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
  };
  if (mq.addEventListener) mq.addEventListener('change', onSchemeChange);
  else if (mq.addListener) mq.addListener(onSchemeChange);

  /* ------------------------------------------------------ nav + scroll-spy */
  var nav = document.getElementById('nav');
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  var ticking = false;

  function update() {
    ticking = false;
    var y = window.scrollY || window.pageYOffset;

    if (nav) nav.classList.toggle('is-stuck', y > 8);

    // The active section is the last one whose top has passed the nav line.
    var line = y + (nav ? nav.offsetHeight : 0) + 120;
    var active = -1;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].offsetTop <= line) active = i;
    }
    // Snap to the final section once the page is scrolled to the bottom.
    if (y + window.innerHeight >= document.body.scrollHeight - 2) {
      active = sections.length - 1;
    }
    for (var j = 0; j < links.length; j++) {
      links[j].classList.toggle('is-active', j === active);
    }
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();

  /* ---------------------------------------------------- autoplaying video */
  var clips = Array.prototype.slice.call(document.querySelectorAll('video[autoplay]'));

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Honour "reduce motion": stop the loop and hand the visitor the controls.
    clips.forEach(function (v) {
      v.autoplay = false;
      v.loop = false;
      v.controls = true;
      v.pause();
    });
  } else if ('IntersectionObserver' in window) {
    // Same clip appears in more than one section; only decode the visible ones.
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var p = entry.target.play();
          if (p && p.catch) p.catch(function () {});
        } else {
          entry.target.pause();
        }
      });
    }, { rootMargin: '200px 0px' });

    clips.forEach(function (v) { vio.observe(v); });
  }

  /* --------------------------------------------------------------- reveal */
  // The class is added here, not in the markup, so content stays visible
  // if scripting is unavailable.
  var groups = ['.hero-main', '.hero-aside', '.section-head', '.work-card',
                '.pub', '.mentor', '.tl-item'];

  if (!('IntersectionObserver' in window)) return;

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.04 });

  groups.forEach(function (selector) {
    var items = document.querySelectorAll(selector);
    Array.prototype.forEach.call(items, function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = Math.min(i, 5) * 60 + 'ms';
      io.observe(el);
    });
  });
})();
