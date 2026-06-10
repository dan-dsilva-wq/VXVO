/* ────────────────────────────────────────────────────────────────
   VXVO — The Demonstration Room · engine room
   Hand-written vanilla JS. No framework, no build step, no tracking.
   Eight working models, one shared power bus, one audio bus.
   ──────────────────────────────────────────────────────────────── */
(() => {
  'use strict';

  const doc = document;
  const html = doc.documentElement;
  const $ = (s, c) => (c || doc).querySelector(s);
  const $$ = (s, c) => Array.from((c || doc).querySelectorAll(s));

  const rmq = matchMedia('(prefers-reduced-motion: reduce)');
  let reduced = rmq.matches;
  if (rmq.addEventListener) rmq.addEventListener('change', (e) => { reduced = e.matches; });

  /* defer non-critical setup off the first task */
  const idle = (fn) => ('requestIdleCallback' in window)
    ? requestIdleCallback(fn, { timeout: 400 })
    : setTimeout(fn, 1);

  /* toggle-button helper: class, ARIA state and glyph stay in sync */
  const setCtl = (btn, on, glyphOff) => {
    btn.classList.toggle('on', on);
    btn.setAttribute('aria-pressed', String(on));
    const g = $('.ctl__glyph', btn);
    if (g && glyphOff !== null) g.textContent = on ? '■' : (glyphOff || '▸');
  };

  /* ── audio bus: only one exhibit makes sound at a time ───────── */
  const AudioBus = {
    current: null,
    claim(stopFn) {
      if (this.current && this.current !== stopFn) this.current();
      this.current = stopFn;
    },
    release(stopFn) {
      if (this.current === stopFn) this.current = null;
    },
  };
  doc.addEventListener('visibilitychange', () => {
    if (doc.hidden && AudioBus.current) AudioBus.current();
  });

  /* offscreen guard: stop a running model when its bench leaves view */
  const exitGuard = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting && e.target.__onExit) e.target.__onExit();
    });
  }, { rootMargin: '80px' });
  const guardExit = (el, fn) => { el.__onExit = fn; exitGuard.observe(el); };

  /* ── reveal choreography ─────────────────────────────────────── */
  const reveals = $$('.reveal');
  if (reduced) {
    reveals.forEach((el) => el.classList.add('in'));
  } else {
    const ro = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach((el) => ro.observe(el));
  }

  /* ── chalk draw-on: strokes draw themselves as they arrive ───── */
  if (!reduced) {
    const groups = $$('.draw');
    /* two passes — all geometry reads first, then all style writes —
       so layout is never invalidated mid-loop */
    const prep = (g) => {
      const parts = $$('path, line, polyline, polygon, circle, rect, ellipse', g)
        .filter((el) => !el.classList.contains('wire'));
      const lens = parts.map((el) => {
        try { return el.getTotalLength(); } catch { return 0; }
      });
      parts.forEach((el, i) => {
        if (!lens[i]) return;
        el.style.strokeDasharray = `${lens[i]}`;
        el.style.strokeDashoffset = `${lens[i]}`;
        el.style.setProperty('--i', i);
      });
      return parts;
    };
    const prepped = new Map(groups.map((g) => [g, prep(g)]));
    const dro = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        (prepped.get(e.target) || []).forEach((el) => {
          el.style.strokeDashoffset = '0';
        });
        dro.unobserve(e.target);
      });
    }, { threshold: 0.25 });
    groups.forEach((g) => dro.observe(g));
  }

  /* ── the power bus: RUN ──────────────────────────────────────── */
  const runBtn = $('#run');
  const runDot = $('#run-dot');
  const runStatus = $('#run-status');
  const runStatusSr = $('#run-status-sr');
  let powered = false;
  let typeTimer = null;

  const typeOut = (el, text) => {
    clearInterval(typeTimer);
    if (reduced) { el.textContent = text; return; }
    let i = 0;
    el.textContent = '';
    typeTimer = setInterval(() => {
      i += 1;
      el.textContent = text.slice(0, i);
      if (i >= text.length) clearInterval(typeTimer);
    }, 18);
  };

  const setPower = (on) => {
    powered = on;
    html.classList.toggle('powered', on);
    runBtn.setAttribute('aria-pressed', String(on));
    typeOut(runStatus, on
      ? 'Power on — 8/8 models ready. Proceed to the floor ↓'
      : 'Power off — models idle. Demos still answer to their own switches.');
    if (runStatusSr) runStatusSr.textContent = on ? 'Power on. Eight models ready.' : 'Power off.';
  };
  runBtn.addEventListener('click', () => setPower(!powered));
  runDot.addEventListener('click', () => setPower(!powered));

  /* ── room clock ──────────────────────────────────────────────── */
  const clock = $('#room-clock');
  const tickClock = () => {
    const d = new Date();
    clock.textContent = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };
  if (clock) {
    tickClock();
    setTimeout(() => { tickClock(); setInterval(tickClock, 60000); }, (60 - new Date().getSeconds()) * 1000);
  }
  const yr = $('#yr');
  if (yr) yr.textContent = String(new Date().getFullYear());

  /* ── deep links: focus the bench you arrived at ──────────────── */
  const focusHash = () => {
    const id = location.hash.slice(1);
    if (!id) return;
    const bench = doc.getElementById(id);
    if (!bench || !bench.classList.contains('bench')) return;
    const name = $('.plate__name', bench);
    if (name) { name.setAttribute('tabindex', '-1'); name.focus({ preventScroll: true }); }
  };
  addEventListener('hashchange', focusHash);
  if (location.hash) setTimeout(focusHash, 60);

  /* ════════════════════════════════════════════════════════════
     EXHIBIT 01 · PACE — put a meal on the scale
     ════════════════════════════════════════════════════════════ */
  (() => {
    const stage = $('[data-stage="pace"]');
    if (!stage) return;
    const MEALS = {
      bowl: { kcal: 540, protein: 24, carbs: 68, fat: 16 },
      salmon: { kcal: 430, protein: 38, carbs: 22, fat: 19 },
      smoothie: { kcal: 310, protein: 11, carbs: 52, fat: 6 },
    };
    const wrap = $('.pace', stage);
    const slot = $('#pace-slot');
    const sr = $('#pace-sr');
    const dials = {
      kcal: $('[data-g="kcal"]', stage),
      protein: $('[data-g="protein"]', stage),
      carbs: $('[data-g="carbs"]', stage),
      fat: $('[data-g="fat"]', stage),
    };
    const current = { kcal: 0, protein: 0, carbs: 0, fat: 0 };
    let raf = null;

    const settle = (targets, label) => {
      cancelAnimationFrame(raf);
      const from = { ...current };
      const t0 = performance.now();
      const D = reduced ? 1 : 850;
      const step = (t) => {
        const p = Math.min(1, (t - t0) / D);
        const e = 1 - Math.pow(1 - p, 3); /* needle settle */
        Object.keys(targets).forEach((k) => {
          current[k] = Math.round(from[k] + (targets[k] - from[k]) * e);
          dials[k].textContent = String(current[k]);
        });
        if (p < 1) { raf = requestAnimationFrame(step); return; }
        wrap.classList.remove('pace--busy');
        wrap.classList.add('pace--done');
        if (sr) sr.textContent = `${label} — ${targets.kcal} kilocalories, ${targets.protein} grams protein, ${targets.carbs} grams carbs, ${targets.fat} grams fat.`;
      };
      raf = requestAnimationFrame(step);
    };

    $$('.pace__meal', stage).forEach((btn) => {
      btn.addEventListener('click', () => {
        $$('.pace__meal', stage).forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
        slot.innerHTML = '';
        const ghost = $('svg', btn).cloneNode(true);
        slot.appendChild(ghost);
        wrap.classList.remove('pace--done');
        wrap.classList.add('pace--busy');
        const label = $('.caption', btn).textContent;
        setTimeout(() => settle(MEALS[btn.dataset.meal], label), reduced ? 0 : 420);
      });
    });
  })();

  /* ════════════════════════════════════════════════════════════
     EXHIBIT 02 · READER — really speaks, word by word
     ════════════════════════════════════════════════════════════ */
  idle(() => {
    const stage = $('[data-stage="reader"]');
    if (!stage) return;
    const para = $('#reader-text p');
    const btn = $('#reader-play');
    const meta = $('#reader-meta');
    const supported = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

    /* split into word spans, remembering each word's char offset */
    const text = para.textContent.replace(/\s+/g, ' ').trim();
    para.textContent = '';
    const words = [];
    let cursor = 0;
    text.split(' ').forEach((w, i) => {
      if (i) { para.appendChild(doc.createTextNode(' ')); cursor += 1; }
      const span = doc.createElement('span');
      span.className = 'w';
      span.textContent = w;
      para.appendChild(span);
      words.push({ span, start: cursor });
      cursor += w.length;
    });

    if (!supported) {
      meta.textContent = 'No voices in this browser — the product ships its own.';
      btn.disabled = true;
      return;
    }

    let voice = null;
    const pickVoice = () => {
      const vs = speechSynthesis.getVoices().filter((v) => v.lang.indexOf('en') === 0);
      voice = vs.find((v) => /natural|neural/i.test(v.name))
        || vs.find((v) => v.lang === 'en-GB')
        || vs[0] || null;
      if (!voice) { meta.textContent = 'Voice: system default'; return; }
      let n = voice.name.replace(/^Microsoft |^Google /, '').replace(/\s*[-–(].*$/, '');
      if (n.length > 24) n = n.slice(0, 23).trimEnd() + '…';
      meta.textContent = `Voice: ${n}`;
    };
    pickVoice();
    if (speechSynthesis.addEventListener) speechSynthesis.addEventListener('voiceschanged', pickVoice);

    let speaking = false;
    let currentU = null;
    const clearWords = () => words.forEach(({ span }) => span.classList.remove('lit', 'done'));
    const stop = () => {
      speechSynthesis.cancel();
      speaking = false;
      setCtl(btn, false);
      AudioBus.release(stop);
    };

    btn.addEventListener('click', () => {
      if (speaking) { stop(); clearWords(); return; }
      AudioBus.claim(stop);
      clearWords();
      const u = new SpeechSynthesisUtterance(text);
      currentU = u;
      if (voice) u.voice = voice;
      u.rate = 1.02;
      u.onboundary = (e) => {
        if (currentU !== u) return;
        if (e.name && e.name !== 'word') return;
        let idx = words.findIndex((w) => w.start > e.charIndex) - 1;
        if (idx < -1) idx = words.length - 1;
        if (idx < 0) idx = 0;
        words.forEach((w, i) => {
          w.span.classList.toggle('lit', i === idx);
          w.span.classList.toggle('done', i < idx);
        });
      };
      u.onend = () => { if (currentU !== u) return; stop(); clearWords(); };
      u.onerror = () => { if (currentU !== u) return; stop(); clearWords(); };
      speaking = true;
      setCtl(btn, true);
      speechSynthesis.speak(u);
    });

    guardExit(stage, () => { if (speaking) { stop(); clearWords(); } });
  });

  /* ════════════════════════════════════════════════════════════
     EXHIBIT 04 · FRIENDSHIP FLOWERS — hold to keep in touch
     ════════════════════════════════════════════════════════════ */
  (() => {
    const svg = $('#flower-svg');
    const btn = $('#flower-hold');
    const meta = $('#flower-meta');
    if (!svg || !btn) return;
    btn.style.touchAction = 'none';
    btn.style.userSelect = 'none';
    btn.style.webkitUserSelect = 'none';

    let downAt = 0;
    let latchTimer = null;
    const bloom = () => {
      clearTimeout(latchTimer);
      svg.classList.add('bloom');
      btn.setAttribute('aria-pressed', 'true');
      meta.textContent = 'In touch — blooming';
    };
    const wilt = () => {
      svg.classList.remove('bloom');
      btn.setAttribute('aria-pressed', 'false');
      meta.textContent = 'Neglected — wilting';
    };
    /* a quick tap (or AT double-tap) latches the bloom for a while;
       a genuine hold blooms only while held */
    const release = () => {
      if (performance.now() - downAt < 300) {
        latchTimer = setTimeout(wilt, 4000);
      } else {
        wilt();
      }
    };

    btn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      if (btn.setPointerCapture) btn.setPointerCapture(e.pointerId);
      downAt = performance.now();
      bloom();
    });
    ['pointerup', 'pointercancel'].forEach((ev) => btn.addEventListener(ev, release));
    btn.addEventListener('contextmenu', (e) => e.preventDefault());
    let keyHeld = false;
    btn.addEventListener('keydown', (e) => {
      if ((e.key === ' ' || e.key === 'Enter') && !keyHeld) {
        keyHeld = true; e.preventDefault(); downAt = performance.now(); bloom();
      }
    });
    btn.addEventListener('keyup', (e) => {
      if (e.key === ' ' || e.key === 'Enter') { keyHeld = false; release(); }
    });
    btn.addEventListener('blur', () => { if (keyHeld) { keyHeld = false; wilt(); } });
  })();

  /* ════════════════════════════════════════════════════════════
     EXHIBIT 05 · RECRUITER LIVE COPILOT — choreographed playback
     ════════════════════════════════════════════════════════════ */
  (() => {
    const stage = $('[data-stage="copilot"]');
    if (!stage) return;
    const wrap = $('.copilot', stage);
    const btn = $('#copilot-play');
    const meta = $('#copilot-meta');
    const steps = $$('[data-t]', stage);
    const CUES = [200, 2100, 3600, 5600, 7400]; /* ms per data-t index */
    const TOTAL = 9000;
    let timers = [];
    let clockTimer = null;
    let playing = false;

    const clearCues = () => {
      steps.forEach((el) => el.classList.remove('on'));
      $$('.copilot__check', stage).forEach((el) => el.classList.remove('done'));
    };
    const stop = (finished) => {
      timers.forEach(clearTimeout);
      clearInterval(clockTimer);
      timers = [];
      playing = false;
      setCtl(btn, false);
      if (!finished) {
        /* interrupted: return to the complete static print */
        clearCues();
        wrap.classList.remove('copilot--armed');
        meta.textContent = 'REC 00:00';
      }
    };

    btn.addEventListener('click', () => {
      if (playing) { stop(false); return; }
      wrap.classList.add('copilot--armed');
      clearCues();
      meta.textContent = 'REC 00:00';
      playing = true;
      setCtl(btn, true);
      const t0 = performance.now();
      clockTimer = setInterval(() => {
        const s = Math.floor((performance.now() - t0) / 1000);
        meta.textContent = `REC 00:${String(s).padStart(2, '0')}`;
      }, 1000);
      steps.forEach((el) => {
        const i = Number(el.dataset.t);
        timers.push(setTimeout(() => {
          el.classList.add('on');
          if (el.classList.contains('copilot__check')) el.classList.add('done');
        }, reduced ? i * 60 : CUES[i] || 0));
      });
      timers.push(setTimeout(() => stop(true), reduced ? 600 : TOTAL));
    });

    guardExit(stage, () => { if (playing) stop(false); });
  })();

  /* ════════════════════════════════════════════════════════════
     EXHIBIT 06 · RECRUITMENT OS — a real, timed local scan
     ════════════════════════════════════════════════════════════ */
  idle(() => {
    const stage = $('[data-stage="recos"]');
    if (!stage) return;
    const input = $('#recos-q');
    const list = $('#recos-rows');
    const meta = $('#recos-meta');

    const FIRST = ['Amara', 'Tomas', 'Priya', 'Jonas', 'Sofia', 'Felix', 'Nadia', 'Marcus', 'Elif', 'Owen', 'Hana', 'Dmitri', 'Carmen', 'Theo', 'Yuki', 'Brendan', 'Ines', 'Kofi', 'Lena', 'Pavel', 'Aoife', 'Santiago', 'Mira', 'Callum', 'Zara'];
    const LAST = ['Okafor', 'Lindqvist', 'Sharma', 'Weber', 'Marino', 'Brandt', 'Haddad', 'Cole', 'Demir', 'Pryce', 'Sato', 'Volkov', 'Reyes', 'Mercer', 'Tanaka', 'Walsh', 'Costa', 'Mensah', 'Hoffman', 'Novak', 'Byrne', 'Vega', 'Kessler', 'Frost', 'Ahmed'];
    const ROLES = ['Frontend engineer', 'Backend engineer', 'Full-stack engineer', 'Product designer', 'Data engineer', 'ML engineer', 'iOS engineer', 'DevOps engineer', 'QA engineer', 'Platform engineer'];
    const SKILLS = ['react', 'typescript', 'python', 'node', 'postgres', 'figma', 'swift', 'kubernetes', 'aws', 'rust', 'go', 'tailwind', 'django', 'terraform'];
    const CITIES = ['London', 'Manchester', 'Bristol', 'Leeds', 'Edinburgh', 'Remote', 'Birmingham', 'Glasgow'];

    /* deterministic pseudo-random so the floor is identical for everyone */
    let seed = 11;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
    const CANDIDATES = Array.from({ length: 50 }, () => {
      const skills = Array.from(new Set([pick(SKILLS), pick(SKILLS), pick(SKILLS)]));
      return {
        name: `${pick(FIRST)} ${pick(LAST)}`,
        role: pick(ROLES),
        skills,
        city: pick(CITIES),
        score: 78 + Math.floor(rnd() * 21),
        hay: '',
      };
    });
    CANDIDATES.forEach((c) => { c.hay = `${c.name} ${c.role} ${c.skills.join(' ')} ${c.city}`.toLowerCase(); });

    const esc = (s) => s.replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
    /* single-pass highlighter: find all token ranges on the raw string,
       merge overlaps, then escape and wrap once — tokens can never
       re-match markup that an earlier token inserted */
    const markUp = (s, tokens) => {
      if (!tokens.length) return esc(s);
      const lower = s.toLowerCase();
      const ranges = [];
      tokens.forEach((t) => {
        let at = 0;
        while ((at = lower.indexOf(t, at)) !== -1) {
          ranges.push([at, at + t.length]);
          at += 1;
        }
      });
      if (!ranges.length) return esc(s);
      ranges.sort((a, b) => a[0] - b[0] || b[1] - a[1]);
      const merged = [];
      ranges.forEach(([a, b]) => {
        const last = merged[merged.length - 1];
        if (last && a <= last[1]) last[1] = Math.max(last[1], b);
        else merged.push([a, b]);
      });
      let out = '';
      let pos = 0;
      merged.forEach(([a, b]) => {
        out += `${esc(s.slice(pos, a))}<mark>${esc(s.slice(a, b))}</mark>`;
        pos = b;
      });
      return out + esc(s.slice(pos));
    };

    const render = (rows, tokens, ms, total) => {
      list.innerHTML = rows.slice(0, 7).map((c) => `
        <li>
          <b>${markUp(c.name, tokens)}</b>
          <span class="caption">${markUp(`${c.role} · ${c.skills.join(', ')} · ${c.city}`, tokens)}</span>
          <span class="score">${c.score}</span>
        </li>`).join('');
      const more = rows.length > 7 ? ` · +${rows.length - 7} more` : '';
      meta.textContent = tokens.length
        ? `${rows.length} / ${total} matched${more} · scanned in ${ms} ms · local, no server`
        : `${total} records · type to scan`;
    };

    const scan = () => {
      const q = input.value.trim().toLowerCase();
      const tokens = q.split(/\s+/).filter(Boolean);
      const t0 = performance.now();
      const rows = tokens.length
        ? CANDIDATES.filter((c) => tokens.every((t) => c.hay.includes(t))).sort((a, b) => b.score - a.score)
        : CANDIDATES.slice(0, 7);
      const ms = Math.max(0.01, performance.now() - t0).toFixed(2);
      render(rows, tokens, ms, CANDIDATES.length);
    };
    input.addEventListener('input', scan);
    scan();
  });

  /* ════════════════════════════════════════════════════════════
     EXHIBIT 07 · TRADE — confidence dial with a settling needle
     ════════════════════════════════════════════════════════════ */
  idle(() => {
    const stage = $('[data-stage="trade"]');
    if (!stage) return;
    const range = $('#trade-range');
    const out = $('#trade-out');
    const needle = $('#trade-needle');
    const ticks = $('.trade__ticks', stage);

    /* engrave the dial ticks */
    let t = '';
    for (let i = 0; i <= 10; i += 1) {
      const a = (-78 + (156 * i) / 10) * (Math.PI / 180);
      const x1 = 110 + Math.sin(a) * 76, y1 = 110 - Math.cos(a) * 76;
      const r2 = i % 5 === 0 ? 66 : 71;
      const x2 = 110 + Math.sin(a) * r2, y2 = 110 - Math.cos(a) * r2;
      t += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" />`;
    }
    ticks.innerHTML = t;

    const set = () => {
      const v = Number(range.value) / 100;
      out.textContent = v.toFixed(2);
      needle.style.transform = `rotate(${(-78 + 156 * v).toFixed(1)}deg)`;
    };
    range.addEventListener('input', set);
    set();
  });

  /* ════════════════════════════════════════════════════════════
     EXHIBIT 08 · TRANSLATOR — the motto, in eleven tongues
     ════════════════════════════════════════════════════════════ */
  (() => {
    const stage = $('[data-stage="translator"]');
    if (!stage) return;
    const line = $('#translator-line');
    const T = {
      en: { t: 'Software, shipped.', dir: 'ltr' },
      fr: { t: 'Du logiciel, livré.', dir: 'ltr' },
      de: { t: 'Software, ausgeliefert.', dir: 'ltr' },
      es: { t: 'Software, entregado.', dir: 'ltr' },
      pt: { t: 'Software, entregue.', dir: 'ltr' },
      pl: { t: 'Oprogramowanie, dostarczone.', dir: 'ltr' },
      ja: { t: 'ソフトウェア、出荷済み。', dir: 'ltr' },
      ko: { t: '소프트웨어, 출시 완료.', dir: 'ltr' },
      zh: { t: '软件，已交付。', dir: 'ltr' },
      ar: { t: 'برمجيات، تم تسليمها.', dir: 'rtl' },
      hi: { t: 'सॉफ़्टवेयर, शिप हो गया।', dir: 'ltr' },
    };
    $$('.chiplet', stage).forEach((chip) => {
      chip.addEventListener('click', () => {
        $$('.chiplet', stage).forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
        const lang = chip.dataset.lang;
        const apply = () => {
          line.textContent = T[lang].t;
          line.lang = lang;
          line.dir = T[lang].dir;
        };
        if (reduced) { apply(); return; }
        line.classList.add('swap');
        setTimeout(() => { apply(); line.classList.remove('swap'); }, 250);
      });
    });
  })();

  /* ════════════════════════════════════════════════════════════
     EXHIBIT 09 · AUTO-MUSIC — composed live, only for this visit
     ════════════════════════════════════════════════════════════ */
  (() => {
    const stage = $('[data-stage="music"]');
    if (!stage) return;
    const btn = $('#music-play');
    const meta = $('#music-meta');
    const notesG = $('#music-notes');
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) { btn.disabled = true; meta.textContent = 'No WebAudio in this browser.'; return; }

    /* A minor pentatonic, two octaves */
    const SCALE = [220.0, 261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99];
    const BPM = 72;
    const EIGHTH = 60 / BPM / 2; /* 8 slots per 4/4 bar */

    let ctx = null, master = null;
    let scheduler = null, nextTime = 0, slot = 0, playing = false, plotX = 14;

    const build = () => {
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.55;
      const delay = ctx.createDelay(1);
      delay.delayTime.value = EIGHTH * 1.5;
      const fb = ctx.createGain(); fb.gain.value = 0.32;
      const wet = ctx.createGain(); wet.gain.value = 0.22;
      delay.connect(fb); fb.connect(delay);
      master.connect(ctx.destination);
      master.connect(delay); delay.connect(wet); wet.connect(ctx.destination);

      /* drone bed */
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = 420; lp.Q.value = 0.6;
      const dg = ctx.createGain(); dg.gain.value = 0.05;
      [110, 164.81].forEach((f, i) => {
        const o = ctx.createOscillator();
        o.type = 'sawtooth';
        o.frequency.value = f;
        o.detune.value = i ? 5 : -4;
        o.connect(lp);
        o.start();
      });
      lp.connect(dg); dg.connect(master);
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.06;
      const lfoG = ctx.createGain(); lfoG.gain.value = 180;
      lfo.connect(lfoG); lfoG.connect(lp.frequency);
      lfo.start();
    };

    const pluck = (time, freq, vel, accent) => {
      const o = ctx.createOscillator();
      o.type = 'triangle';
      o.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, time);
      g.gain.exponentialRampToValueAtTime(vel, time + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, time + (accent ? 1.4 : 0.8));
      o.connect(g); g.connect(master);
      o.start(time); o.stop(time + 1.6);
      /* plot the note on the staff */
      const idx = SCALE.indexOf(freq);
      const cy = 104 - (idx / (SCALE.length - 1)) * 88;
      const c = doc.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('cx', plotX.toFixed(0));
      c.setAttribute('cy', cy.toFixed(0));
      c.setAttribute('r', accent ? 4 : 3);
      if (accent) c.setAttribute('class', 'acc');
      notesG.appendChild(c);
      plotX += 9;
      if (plotX > 446) { plotX = 14; notesG.innerHTML = ''; }
    };

    const tick = () => {
      while (nextTime < ctx.currentTime + 0.12) {
        if (Math.random() < 0.34) {
          const deg = Math.floor(Math.random() * SCALE.length);
          const accent = Math.random() < 0.12;
          pluck(nextTime, SCALE[deg], 0.08 + Math.random() * 0.16, accent);
          if (accent && deg + 3 < SCALE.length) pluck(nextTime + 0.02, SCALE[deg + 3], 0.07, false);
        }
        slot += 1;
        if (slot % 8 === 0) meta.textContent = `Composing — bar ${slot / 8 + 1} · A minor pentatonic · ${BPM} bpm`;
        nextTime += EIGHTH;
      }
    };

    const stop = () => {
      if (!playing) return;
      playing = false;
      clearInterval(scheduler);
      if (ctx) ctx.suspend();
      setCtl(btn, false);
      meta.textContent = 'Idle — A minor pentatonic, 72 bpm';
      AudioBus.release(stop);
    };

    btn.addEventListener('click', async () => {
      if (playing) { stop(); return; }
      /* claim the playing flag synchronously so a double-click can't
         spawn a second scheduler while resume() is in flight */
      playing = true;
      AudioBus.claim(stop);
      if (!ctx) build();
      slot = 0;
      setCtl(btn, true);
      meta.textContent = `Composing — bar 1 · A minor pentatonic · ${BPM} bpm`;
      try { await ctx.resume(); } catch { stop(); return; }
      if (!playing) return; /* stopped while resuming */
      nextTime = ctx.currentTime + 0.06;
      scheduler = setInterval(tick, 60);
    });

    guardExit(stage, stop);
  })();

  /* ── reserved bench: stamp the address ───────────────────────── */
  (() => {
    const btn = $('#copy-mail');
    const note = $('#copy-note');
    if (!btn) return;
    let noteTimer = null;
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText('admin@vxvo.co.uk');
        note.textContent = 'Stamped — address copied.';
      } catch {
        note.textContent = 'admin@vxvo.co.uk — select and copy.';
      }
      clearTimeout(noteTimer);
      noteTimer = setTimeout(() => { note.textContent = ''; }, 4000);
    });
  })();
})();
