// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Reveal-on-scroll
const revealTargets = document.querySelectorAll('.section, .card, .hero-title .line, .hero-sub, .hero-cta, .stats, .eyebrow');
revealTargets.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
revealTargets.forEach(el => io.observe(el));

// Subtle parallax on background orbs
const orbs = document.querySelectorAll('.orb');
let raf = 0, mx = 0, my = 0, tx = 0, ty = 0;
window.addEventListener('pointermove', (e) => {
  mx = (e.clientX / window.innerWidth - 0.5) * 2;
  my = (e.clientY / window.innerHeight - 0.5) * 2;
  if (!raf) raf = requestAnimationFrame(loop);
}, { passive: true });
function loop() {
  raf = 0;
  tx += (mx - tx) * 0.06;
  ty += (my - ty) * 0.06;
  orbs.forEach((o, i) => {
    const k = (i + 1) * 14;
    o.style.transform = `translate3d(${tx * k}px, ${ty * k}px, 0)`;
  });
  if (Math.abs(mx - tx) > 0.001 || Math.abs(my - ty) > 0.001) raf = requestAnimationFrame(loop);
}

// Count-up for stats
const counters = document.querySelectorAll('.stats dd[data-count]');
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = parseInt(el.dataset.count, 10);
    const duration = 1100;
    const start = performance.now();
    const from = 0;
    function tick(t) {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(from + (target - from) * eased);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    countObserver.unobserve(el);
  });
}, { threshold: 0.4 });
counters.forEach(c => countObserver.observe(c));
