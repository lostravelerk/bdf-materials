/**
 * bdf 贝多芬新材料 — Dynamic Effects v2.0
 * Hero parallax + mouse tracking + scroll fade-in + counter + nav highlight
 */
(function () {
  'use strict';

  /* ═══════════════════════════════════════
     1. Hero — Parallax + Mouse Tracking
     ═══════════════════════════════════════ */
  var hero = document.querySelector('.hero');
  var glow1 = hero && hero.querySelector('.hero-glow-1');
  var glow2 = hero && hero.querySelector('.hero-glow-2');
  var mouseX = 0, mouseY = 0, ticking = false;

  function updateGlow() {
    if (!glow1 || !glow2) return;
    var scrollOffset = window.scrollY * 0.04;
    glow1.style.transform = 'translate(' + (mouseX * 30) + 'px, ' + (mouseY * 30 + scrollOffset) + 'px)';
    glow2.style.transform = 'translate(' + (-mouseX * 20) + 'px, ' + (-mouseY * 20 - scrollOffset * 0.6) + 'px)';
    ticking = false;
  }

  function onMouseMove(e) {
    if (!hero) return;
    var rect = hero.getBoundingClientRect();
    mouseX = (e.clientX - rect.left) / rect.width - 0.5;
    mouseY = (e.clientY - rect.top) / rect.height - 0.5;
    if (!ticking) { ticking = true; requestAnimationFrame(updateGlow); }
  }

  function onScrollGlow() {
    if (!ticking) { ticking = true; requestAnimationFrame(updateGlow); }
  }

  if (hero) {
    hero.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScrollGlow, { passive: true });
  }

  /* ═══════════════════════════════════════
     2. Nav — Scroll Effect + Mobile Toggle
     ═══════════════════════════════════════ */
  var nav = document.getElementById('nav');

  window.addEventListener('scroll', function () {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  var toggle = document.getElementById('navToggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      if (nav) nav.classList.toggle('open');
    });
  }

  var navLinkEls = document.querySelectorAll('.nav-links a');
  navLinkEls.forEach(function (link) {
    link.addEventListener('click', function () {
      if (nav) nav.classList.remove('open');
    });
  });

  /* ═══════════════════════════════════════
     3. Scroll Fade-In — Intersection Observer
     ═══════════════════════════════════════ */
  var fadeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

  // Observe all .anim-fade elements
  document.querySelectorAll('.anim-fade').forEach(function (el) {
    fadeObserver.observe(el);
  });

  // Observe grid children — auto-add anim-fade with staggered delays
  document.querySelectorAll('.anim-grid').forEach(function (grid) {
    var children = grid.children;
    for (var i = 0; i < children.length; i++) {
      children[i].classList.add('anim-fade');
      children[i].style.setProperty('--stagger', (i * 0.08) + 's');
      fadeObserver.observe(children[i]);
    }
  });

  /* ═══════════════════════════════════════
     4. Number Counter — easeOutExpo
     ═══════════════════════════════════════ */
  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var card = entry.target;
      var counterSpan = card.querySelector('.cap-counter');
      var target = parseInt(card.getAttribute('data-count'), 10);
      if (!counterSpan || isNaN(target)) return;

      var duration = 1600;
      var startTime = performance.now();

      function tick(now) {
        var elapsed = now - startTime;
        var progress = Math.min(elapsed / duration, 1);
        var eased = easeOutExpo(progress);
        counterSpan.textContent = Math.round(target * eased);
        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      }

      requestAnimationFrame(tick);
      counterObserver.unobserve(card);
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.cap-number[data-count]').forEach(function (el) {
    counterObserver.observe(el);
  });

  /* ═══════════════════════════════════════
     5. Navigation Active Highlight
     ═══════════════════════════════════════ */
  var sections = document.querySelectorAll('section[id], footer[id]');
  var navLinks = document.querySelectorAll('.nav-links a');

  var navObserver = new IntersectionObserver(function (entries) {
    // Find the entry with the highest intersection ratio
    var best = null;
    entries.forEach(function (e) {
      if (!best || e.intersectionRatio > best.intersectionRatio) {
        best = e;
      }
    });
    if (!best || best.intersectionRatio < 0.15) return;

    var id = best.target.id;
    navLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      link.classList.toggle('nav-active', href === '#' + id);
    });
  }, { threshold: [0, 0.15, 0.3, 0.5, 0.7] });

  sections.forEach(function (section) {
    navObserver.observe(section);
  });

})();
