(function () {
  "use strict";

  // ---------- Always open at the top ----------
  if (location.hash) {
    history.replaceState(null, "", location.pathname + location.search);
  }
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  window.scrollTo(0, 0);
  window.addEventListener("load", function () {
    window.scrollTo(0, 0);
  });

  // ---------- Background music ----------
  var bgm = document.getElementById("bgm");
  var musicToggle = document.getElementById("musicToggle");
  var isPlaying = false;
  if (bgm) bgm.volume = 0.8;

  function playMusic() {
    document.removeEventListener("click", playMusic);
    document.removeEventListener("touchstart", playMusic);
    if (!bgm || isPlaying) return;
    isPlaying = true;
    if (musicToggle) musicToggle.classList.add("is-playing");
    bgm.play().catch(function () {
      isPlaying = false;
      if (musicToggle) musicToggle.classList.remove("is-playing");
    });
  }

  function pauseMusic() {
    if (!bgm) return;
    bgm.pause();
    isPlaying = false;
    if (musicToggle) musicToggle.classList.remove("is-playing");
  }

  if (musicToggle) {
    musicToggle.addEventListener("click", function () {
      if (isPlaying) {
        pauseMusic();
      } else {
        playMusic();
      }
    });
  }

  playMusic();
  document.addEventListener("click", playMusic, { once: true });
  document.addEventListener("touchstart", playMusic, { once: true });

  // ---------- Save the date scroll ----------
  var saveDateBtn = document.getElementById("saveDateBtn");
  if (saveDateBtn) {
    saveDateBtn.addEventListener("click", function () {
      var target = document.getElementById("ceremony");
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  }

  // ---------- Scroll reveal ----------
  var revealTargets = document.querySelectorAll("[data-reveal], .footer");
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealTargets.forEach(function (el) { observer.observe(el); });

  // ---------- Countdown ----------
  var WEDDING_DATE = new Date("2026-10-05T11:30:00+09:00");
  var elD = document.getElementById("cd-d");
  var elH = document.getElementById("cd-h");
  var elM = document.getElementById("cd-m");
  var elS = document.getElementById("cd-s");

  function pad(n) { return String(n).padStart(2, "0"); }

  function updateCountdown() {
    var diff = WEDDING_DATE.getTime() - Date.now();
    if (diff < 0) diff = 0;
    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);
    if (elD) elD.textContent = pad(d);
    if (elH) elH.textContent = pad(h);
    if (elM) elM.textContent = pad(m);
    if (elS) elS.textContent = pad(s);
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ---------- Toast ----------
  var toast = document.getElementById("toast");
  var toastTimer = null;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("is-show");
    }, 1800);
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
    return Promise.resolve();
  }

  // ---------- Copy account numbers ----------
  document.querySelectorAll(".btn--copy").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var value = btn.getAttribute("data-copy") || "";
      var message = btn.getAttribute("data-copy-message") || "계좌번호가 복사되었습니다";
      copyText(value).then(function () {
        showToast(message);
      });
    });
  });

  // ---------- Gallery lightbox ----------
  var galleryImages = Array.prototype.map.call(
    document.querySelectorAll("#galleryGrid .gallery__item img"),
    function (img) { return img.getAttribute("src"); }
  );
  var lightbox = document.getElementById("lightbox");
  var lightboxTrack = document.getElementById("lightboxTrack");

  galleryImages.forEach(function (src) {
    var slide = document.createElement("div");
    slide.className = "lightbox__slide";
    var img = document.createElement("img");
    img.src = src;
    img.alt = "";
    slide.appendChild(img);
    lightboxTrack.appendChild(slide);
  });

  function openLightbox(index) {
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    lightboxTrack.scrollLeft = index * lightboxTrack.clientWidth;
  }
  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
  }

  document.querySelectorAll(".gallery__item").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openLightbox(Number(btn.getAttribute("data-index")));
    });
  });
  document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") lightboxTrack.scrollBy({ left: -lightboxTrack.clientWidth, behavior: "smooth" });
    if (e.key === "ArrowRight") lightboxTrack.scrollBy({ left: lightboxTrack.clientWidth, behavior: "smooth" });
  });
})();
