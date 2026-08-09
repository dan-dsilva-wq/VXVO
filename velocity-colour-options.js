(() => {
  const options = [
    {
      id: "rsd-aqua", number: "01", name: "RSD Aqua", descriptor: "Closest to the live RSD website", palette: ["#2d898d", "#e27b2e", "#112a32", "#f5faf8"],
      why: "The safest brand hand-off: keeps the aqua/teal energy and orange action colour, but gives the CRM cleaner neutral surfaces.", fit: "Most recognisable to RSD customers and candidates.", contrast: "High-contrast text / surface base",
    },
    {
      id: "harbour-blue", number: "02", name: "Harbour Blue", descriptor: "Professional, open and dependable", palette: ["#0a4c8a", "#42b2b7", "#d17a22", "#f4f8fc"],
      why: "Blue carries trust and operational clarity; teal keeps it human; orange marks action without leaning on red/green status pairs.", fit: "Best all-rounder for a recruitment CRM used by clients and consultants.", contrast: "Strong light-mode reading contrast",
    },
    {
      id: "deep-teal", number: "03", name: "Deep Teal", descriptor: "Confident brand colour with a calm canvas", palette: ["#163d45", "#6fd0bf", "#ffb15b", "#0d2830"],
      why: "A more grown-up version of RSD’s teal: the dark shell gives focus, while mint and amber provide clear, non-red/green signals.", fit: "Good if the team wants a distinctive branded dark mode.", contrast: "Dark shell with bright status cues",
    },
    {
      id: "paper-cobalt", number: "04", name: "Paper + Cobalt", descriptor: "Editorial, bright and easy to scan", palette: ["#235db7", "#e38b2f", "#102a43", "#f7f5ef"],
      why: "A light-first dashboard reduces visual fatigue. Cobalt gives structure; orange is reserved for the next best action.", fit: "Strong choice for longer desk sessions and dense tables.", contrast: "Light-first, high legibility",
    },
    {
      id: "slate-mint", number: "05", name: "Slate Mint", descriptor: "Quiet, warm and people-focused", palette: ["#218a72", "#c86b42", "#213635", "#edf1ef"],
      why: "The soft grey-green base feels less corporate and less aggressive, while coral-orange adds warmth without making errors look alarming.", fit: "Good fit for a relationship-led recruitment culture.", contrast: "Soft surface with dark text anchors",
    },
    {
      id: "midnight-sky", number: "06", name: "Midnight Sky", descriptor: "A clearer dark mode than the current demo", palette: ["#69b9ff", "#f2b65d", "#0b1525", "#14263c"],
      why: "Keeps the focus of dark mode but removes the green/lime dominance. Sky blue and amber separate through hue and lightness.", fit: "Best dark-mode option for an energetic sales desk.", contrast: "High-luminance accents on deep navy",
    },
    {
      id: "charcoal-coral", number: "07", name: "Charcoal + Coral", descriptor: "Warm, decisive and contemporary", palette: ["#f48570", "#75c5c0", "#191a1d", "#25272b"],
      why: "Coral becomes the brand signature, not an error signal; soft teal is the balancing cue. Every status still carries a readable label.", fit: "Good for a modern, personality-led internal product.", contrast: "Strong type hierarchy over charcoal",
    },
    {
      id: "ink-lilac", number: "08", name: "Ink + Lilac", descriptor: "Premium, distinct and less expected", palette: ["#c8a8ff", "#78d5c4", "#131425", "#20233b"],
      why: "A calmer premium direction that avoids the usual red/green CRM language. Lilac is the highlight; mint carries progress.", fit: "Good if Velocity should feel like a considered product, not a spreadsheet.", contrast: "Bright accents with explicit status copy",
    },
    {
      id: "sunlit-navy", number: "09", name: "Sunlit Navy", descriptor: "Classic business colour with a warmer edge", palette: ["#214f7d", "#d69a3e", "#152b43", "#f5f3e9"],
      why: "The safest executive-facing option: navy establishes confidence, parchment keeps the screen welcoming, and gold makes wins visible.", fit: "Best if managers and clients will see the same home view.", contrast: "Very clear light-mode hierarchy",
    },
    {
      id: "mono-orange", number: "10", name: "Mono + Orange", descriptor: "Accessibility-first and unmistakably RSD", palette: ["#111111", "#e0652e", "#f6f6f4", "#ffffff"],
      why: "Almost all meaning comes from typography, position, labels and shape. Orange is a memorable brand accent, never the only status cue.", fit: "Best benchmark for the most colour-blind-friendly direction.", contrast: "Strongest monochrome contrast benchmark",
    },
  ];

  const grid = document.querySelector("#options-grid");
  const selection = document.querySelector("#selection");
  if (!grid || !selection) return;

  const miniMarkup = (option) => `
    <div class="mini-crm" aria-label="${option.name} mini dashboard preview">
      <aside class="mini-sidebar"><div class="mini-logo">V</div><strong>Velocity</strong><small>Teams</small><nav><b class="active">Home</b><b>Today</b><b>Clients</b></nav><span class="mini-sidebar-foot">RSD</span></aside>
      <div class="mini-main"><header><span>Velocity Teams&nbsp; / &nbsp;<b>Home</b></span><em>Read-only</em></header><div class="mini-body"><p class="mini-kicker">VELOCITY LEAGUE</p><div class="mini-heading"><h4>Good morning, Alex.</h4><span>Illustrative data</span></div><div class="mini-top-grid"><div class="mini-score"><small>Current score</small><strong>186</strong><span>#2 · 24 pts to #1</span></div><div class="mini-reward"><small>First place</small><b>£250</b><span>Team reward</span></div></div><div class="mini-metrics"><div><small>Calls</small><b>42</b></div><div><small>CVs</small><b>16</b></div><div><small>Interviews</small><b>8</b></div><div><small>Offers</small><b>3</b></div></div><div class="mini-table"><div><span>Team leaderboard</span><b>Company view</b></div><i><em style="width:100%"></em></i><i><em style="width:88%"></em></i><i><em style="width:68%"></em></i></div></div></div>
    </div>`;

  grid.innerHTML = options.map((option) => `
    <article class="option-card theme-${option.id}" data-option="${option.id}">
      <header class="option-head"><div class="option-number">${option.number}</div><div><p>${option.descriptor}</p><h3>${option.name}</h3></div><span class="option-contrast">${option.contrast}</span></header>
      ${miniMarkup(option)}
      <div class="option-details"><div class="option-copy"><p><strong>Why it works</strong>${option.why}</p><p><strong>Best fit</strong>${option.fit}</p></div><div class="option-swatches" aria-label="${option.name} palette">${option.palette.map((colour) => `<i style="--swatch:${colour}" title="${colour}" aria-label="${colour}"></i>`).join("")}</div></div>
      <button class="option-select" type="button" data-select="${option.id}">Choose this direction <span aria-hidden="true">→</span></button>
    </article>
  `).join("");

  grid.querySelectorAll("[data-select]").forEach((button) => button.addEventListener("click", () => {
    const selectedId = button.dataset.select;
    const option = options.find((item) => item.id === selectedId);
    grid.querySelectorAll(".option-card").forEach((card) => card.classList.toggle("selected", card.dataset.option === selectedId));
    selection.classList.add("has-selection");
    selection.querySelector("span:nth-child(2)").textContent = `Selected: ${option.number} · ${option.name}`;
    selection.querySelector("small").textContent = "This is the direction I’ll carry into the next CRM colour pass.";
    document.querySelector(`#${selectedId}`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }));
})();
