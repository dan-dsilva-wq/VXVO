/* VXVO — interactions
   reveal-on-scroll · count-up · card tilt + glare · cursor spotlight · nav */

(() => {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── current year ─────────────────────────────────────────── */
  const yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ── nav: condense on scroll ──────────────────────────────── */
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ── mobile menu ──────────────────────────────────────────── */
  const burger = document.getElementById("burger");
  const menu = document.getElementById("mobileMenu");
  if (burger && menu) {
    const toggle = (open) => {
      const next = open ?? menu.hasAttribute("hidden");
      menu.toggleAttribute("hidden", !next);
      nav.classList.toggle("open", next);
      burger.setAttribute("aria-expanded", String(next));
    };
    burger.addEventListener("click", () => toggle());
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => toggle(false)));
  }

  /* ── reveal on scroll ─────────────────────────────────────── */
  const revealables = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    revealables.forEach((el) => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealables.forEach((el) => io.observe(el));
  }

  /* ── count-up ─────────────────────────────────────────────── */
  const counters = document.querySelectorAll("[data-count]");
  const runCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    if (reduce || !Number.isFinite(target)) { el.textContent = target; return; }
    const dur = 1100;
    let start = null;
    const tick = (t) => {
      if (start === null) start = t;
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    };
    requestAnimationFrame(tick);
  };
  if ("IntersectionObserver" in window && !reduce) {
    const cio = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) { runCount(e.target); cio.unobserve(e.target); }
        }
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => cio.observe(el));
  } else {
    counters.forEach(runCount);
  }

  /* ── card tilt + glare (pointer, fine only) ───────────────── */
  const fine = window.matchMedia("(pointer: fine)").matches;
  if (fine && !reduce) {
    const tilters = document.querySelectorAll("[data-tilt]");
    const MAX = 5; // deg
    tilters.forEach((card) => {
      let raf = 0;
      const move = (ev) => {
        const r = card.getBoundingClientRect();
        const px = (ev.clientX - r.left) / r.width;
        const py = (ev.clientY - r.top) / r.height;
        card.style.setProperty("--gx", (px * 100).toFixed(1) + "%");
        card.style.setProperty("--gy", (py * 100).toFixed(1) + "%");
        if (raf) return;
        raf = requestAnimationFrame(() => {
          const rx = (0.5 - py) * MAX * 2;
          const ry = (px - 0.5) * MAX * 2;
          card.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-4px)`;
          raf = 0;
        });
      };
      const reset = () => {
        if (raf) cancelAnimationFrame(raf), (raf = 0);
        card.style.transform = "";
      };
      card.addEventListener("pointermove", move);
      card.addEventListener("pointerleave", reset);
    });

    /* ── cursor spotlight in hero ───────────────────────────── */
    const spot = document.getElementById("spot");
    const hero = document.getElementById("hero");
    if (spot && hero) {
      hero.addEventListener("pointermove", (e) => {
        spot.style.opacity = "1";
        spot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
      });
      hero.addEventListener("pointerleave", () => (spot.style.opacity = "0"));
    }
  }
})();
