/* NAIMAT KADA — interactions: mobile menu, active nav, reveal, counters, lightbox */
(function () {
  "use strict";

  /* Mobile menu — instant toggle, no transition */
  var toggle = document.getElementById("menuToggle");
  var nav = document.getElementById("mainNav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  /* Active nav link on scroll */
  var navLinks = nav ? Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]')) : [];
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (a) {
            a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
          });
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach(function (s) { observer.observe(s); });
  }

  /* Reveal on scroll + safety net for screenshot renderers */
  var revealEls = document.querySelectorAll(".section, .trust, .counters, .hero");
  revealEls.forEach(function (el) { el.classList.add("reveal"); });
  function showAll() { revealEls.forEach(function (el) { el.classList.add("visible"); }); }
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else { showAll(); }
  setTimeout(showAll, 2500);

  /* Animated counters — real numbers only */
  var counters = document.querySelectorAll(".count");
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute("data-target"));
    var decimal = el.hasAttribute("data-decimal") ? 1 : 0;
    var start = null, dur = 1400;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var val = target * (1 - Math.pow(1 - p, 3));
      el.textContent = decimal ? val.toFixed(1) : Math.round(val).toLocaleString("en-US");
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = decimal ? target.toFixed(1) : target.toLocaleString("en-US");
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window && counters.length) {
    var cObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animateCounter(entry.target); cObs.unobserve(entry.target); }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { cObs.observe(el); });
  } else { counters.forEach(animateCounter); }

  /* Lightbox gallery */
  var items = Array.prototype.slice.call(document.querySelectorAll(".gallery-item"));
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var closeBtn = document.getElementById("lightboxClose");
  var prevBtn = document.getElementById("lightboxPrev");
  var nextBtn = document.getElementById("lightboxNext");
  var current = 0, lastFocus = null;
  function show(i) {
    current = (i + items.length) % items.length;
    var img = items[current].querySelector("img");
    lightboxImg.src = items[current].getAttribute("data-full");
    lightboxImg.alt = img ? img.alt : "";
  }
  function open(i) {
    lastFocus = document.activeElement;
    show(i);
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }
  function close() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  items.forEach(function (item, i) {
    item.addEventListener("click", function () { open(i); });
  });
  if (closeBtn) closeBtn.addEventListener("click", close);
  if (prevBtn) prevBtn.addEventListener("click", function () { show(current - 1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { show(current + 1); });
  lightbox.addEventListener("click", function (e) { if (e.target === lightbox) close(); });
  document.addEventListener("keydown", function (e) {
    if (lightbox.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });
})();
