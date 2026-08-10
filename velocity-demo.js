(() => {
  const data = {
    week: {
      score: "186",
      rank: "#2 · 24 pts to #1",
      teamTotal: "612",
      reset: "Resets every Monday",
      period: "this week",
      reward: "£250 team reward",
      rewardDetail: "A team lunch and a half-day finish for first place.",
      leader: "Priya Shah",
      cycle: "10–16 August 2026",
      status: "Within a sprint",
      routeTitle: "Turn a good week into a great one",
      routeTotal: "+35 pts in view",
      routeCopy: "Start with a few manageable wins. The rest of the board can wait.",
      route: ["Book 1 interview", "+15 pts", "Send 3 approved CVs", "+12 pts", "Close 2 call notes", "+8 pts"],
      metrics: { calls: ["42", "18 connected"], cvs: ["16", "approved activity"], interviews: ["8", "6 attended"], offers: ["3", "1 placement"], turnover: ["£8,400", "shown separately from points"] },
    },
    month: {
      score: "742",
      rank: "#1 · You’re leading",
      teamTotal: "2,480",
      reset: "Resets on 1 September",
      period: "this month",
      reward: "£500 team reward",
      rewardDetail: "A team experience chosen by the monthly winner.",
      leader: "Alex Morgan",
      cycle: "August 2026",
      status: "Leading",
      routeTitle: "Keep the lead warm",
      routeTotal: "Protect it",
      routeCopy: "Keep doing the work that got you there. Your next best move is visible below.",
      route: ["Protect the lead", "+20 pts", "Keep interview notes current", "+12 pts", "Help one teammate close a gap", "+10 pts"],
      metrics: { calls: ["168", "71 connected"], cvs: ["64", "approved activity"], interviews: ["31", "24 attended"], offers: ["9", "4 placements"], turnover: ["£31,200", "shown separately from points"] },
    },
  };

  const paletteOptions = [
    { id: "rsd-aqua", number: "01", name: "RSD Aqua", descriptor: "Closest to the live RSD website", why: "Aqua/teal energy with an orange action colour — the clearest RSD hand-off.", palette: ["#2d898d", "#e27b2e", "#112a32", "#eff8f7"] },
    { id: "harbour-blue", number: "02", name: "Harbour Blue", descriptor: "Professional, open and dependable", why: "Trusty blue structure with teal warmth and orange action cues.", palette: ["#0a4c8a", "#42b2b7", "#d17a22", "#eef4fa"] },
    { id: "deep-teal", number: "03", name: "Deep Teal", descriptor: "Confident brand colour with a calm canvas", why: "A grown-up dark teal with mint and amber signals that do not depend on red and green.", palette: ["#163d45", "#6fd0bf", "#ffb15b", "#0d2830"] },
    { id: "paper-cobalt", number: "04", name: "Paper + Cobalt", descriptor: "Editorial, bright and easy to scan", why: "A light-first direction for long desk sessions, with cobalt structure and warm action.", palette: ["#235db7", "#e38b2f", "#102a43", "#f7f5ef"] },
    { id: "slate-mint", number: "05", name: "Slate Mint", descriptor: "Quiet, warm and people-focused", why: "Soft grey-green surfaces make the CRM feel more human and less like a sales spreadsheet.", palette: ["#218a72", "#c86b42", "#213635", "#edf1ef"] },
    { id: "midnight-sky", number: "06", name: "Midnight Sky", descriptor: "A clearer dark mode than the current demo", why: "Keeps dark mode focused, replacing lime dominance with sky blue and amber.", palette: ["#69b9ff", "#f2b65d", "#0b1525", "#14263c"] },
    { id: "charcoal-coral", number: "07", name: "Charcoal + Coral", descriptor: "Warm, decisive and contemporary", why: "Coral becomes the brand signature, balanced by soft teal rather than an error red.", palette: ["#f48570", "#75c5c0", "#191a1d", "#25272b"] },
    { id: "ink-lilac", number: "08", name: "Ink + Lilac", descriptor: "Premium, distinct and less expected", why: "A considered product feel with lilac highlights and mint progress cues.", palette: ["#c8a8ff", "#78d5c4", "#131425", "#20233b"] },
    { id: "sunlit-navy", number: "09", name: "Sunlit Navy", descriptor: "Classic business colour with a warmer edge", why: "Executive-friendly navy with a welcoming parchment canvas and gold wins.", palette: ["#214f7d", "#d69a3e", "#152b43", "#f5f3e9"] },
    { id: "mono-orange", number: "10", name: "Mono + Orange", descriptor: "Accessibility-first and unmistakably RSD", why: "Meaning comes from labels, position and shape first; orange is the memorable accent.", palette: ["#111111", "#e0652e", "#f6f6f4", "#ffffff"] },
  ];

  const root = document.body;
  const sidebar = document.querySelector(".demo-sidebar");
  const setMenu = (open) => root.toggleAttribute("data-menu-open", open);
  document.querySelector("[data-open-menu]")?.addEventListener("click", () => setMenu(true));
  document.querySelectorAll("[data-close-menu]").forEach((element) => element.addEventListener("click", () => setMenu(false)));
  document.querySelector(".demo-scrim")?.addEventListener("click", () => setMenu(false));

  const setText = (selector, value) => document.querySelectorAll(selector).forEach((element) => { element.textContent = value; });
  const setPeriod = (period) => {
    const values = data[period];
    document.querySelectorAll("[data-period]").forEach((button) => {
      const selected = button.dataset.period === period;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-selected", String(selected));
    });
    setText("[data-score]", values.score);
    setText("[data-rank-label]", values.rank);
    setText("[data-team-total]", values.teamTotal);
    setText("[data-reset]", values.reset);
    setText("[data-period-copy]", values.period);
    setText("[data-reward]", values.reward);
    setText("[data-reward-detail]", values.rewardDetail);
    setText("[data-leader]", values.leader);
    setText("[data-cycle]", values.cycle);
    setText("[data-status]", values.status);
    setText("[data-route-title]", values.routeTitle);
    setText("[data-route-total]", values.routeTotal);
    setText("[data-route-copy]", values.routeCopy);
    ["one", "two", "three"].forEach((name, index) => {
      setText(`[data-route-${name}]`, values.route[index * 2]);
      setText(`[data-route-${name}-points]`, values.route[index * 2 + 1]);
    });
    Object.entries(values.metrics).forEach(([metric, [value, note]]) => {
      setText(`[data-metric="${metric}"]`, value);
      setText(`[data-metric-note="${metric}"]`, note);
    });
    if (sidebar) sidebar.setAttribute("aria-label", `Demo navigation · ${values.period}`);
  };

  document.querySelectorAll("[data-period]").forEach((button) => button.addEventListener("click", () => setPeriod(button.dataset.period)));

  const palettePicker = document.querySelector(".demo-palette-picker");
  const paletteStage = document.querySelector("[data-palette-stage]");
  const paletteTabs = document.querySelector("[data-palette-tabs]");
  if (palettePicker && paletteStage && paletteTabs) {
    let paletteIndex = Math.max(0, paletteOptions.findIndex((option) => option.id === root.dataset.palette));
    let pickedPalette = null;
    let touchStartX = null;
    const position = document.querySelector("[data-palette-position]");
    const descriptor = document.querySelector("[data-palette-descriptor]");
    const name = document.querySelector("[data-palette-name]");
    const why = document.querySelector("[data-palette-why]");
    const swatches = document.querySelector("[data-palette-swatches]");
    const current = document.querySelector("[data-palette-current]");
    const picked = document.querySelector("[data-palette-picked]");
    const status = document.querySelector("[data-palette-status]");
    const pickButton = document.querySelector("[data-palette-pick]");

    paletteTabs.innerHTML = paletteOptions.map((option) => `<button class="demo-palette-tab" type="button" role="tab" data-palette-tab="${option.id}" aria-selected="false" aria-label="View ${option.number} ${option.name}"><b>${option.number}</b><span>${option.name}</span></button>`).join("");

    const renderPalette = (nextIndex, announce = true) => {
      paletteIndex = (nextIndex + paletteOptions.length) % paletteOptions.length;
      const option = paletteOptions[paletteIndex];
      root.dataset.palette = option.id;
      position.textContent = option.number;
      descriptor.textContent = option.descriptor;
      name.textContent = option.name;
      why.textContent = option.why;
      current.textContent = `${option.number} · ${option.name}`;
      swatches.innerHTML = option.palette.map((colour) => `<i style="--swatch:${colour}" title="${colour}" aria-label="${colour}"></i>`).join("");
      paletteTabs.querySelectorAll("[data-palette-tab]").forEach((tab) => {
        const selected = tab.dataset.paletteTab === option.id;
        tab.setAttribute("aria-selected", String(selected));
        tab.tabIndex = selected ? 0 : -1;
      });
      if (announce) status.textContent = `Viewing ${option.number} · ${option.name}. Keep flicking or choose it below.`;
      if (pickedPalette === option.id) {
        palettePicker.classList.add("picked");
        picked.textContent = `Chosen: ${option.number} · ${option.name}`;
        pickButton.innerHTML = "CHOSEN ✓ <span aria-hidden=\"true\">→</span>";
      } else {
        palettePicker.classList.remove("picked");
        picked.textContent = "Viewing ";
        const currentLabel = document.createElement("b");
        currentLabel.textContent = `${option.number} · ${option.name}`;
        picked.append(currentLabel);
        pickButton.innerHTML = "THAT ONE! <span aria-hidden=\"true\">→</span>";
      }
    };

    paletteTabs.querySelectorAll("[data-palette-tab]").forEach((tab) => tab.addEventListener("click", () => renderPalette(paletteOptions.findIndex((option) => option.id === tab.dataset.paletteTab))));
    document.querySelector("[data-palette-prev]")?.addEventListener("click", () => renderPalette(paletteIndex - 1));
    document.querySelector("[data-palette-next]")?.addEventListener("click", () => renderPalette(paletteIndex + 1));
    pickButton?.addEventListener("click", () => {
      const option = paletteOptions[paletteIndex];
      pickedPalette = option.id;
      palettePicker.classList.add("picked");
      pickButton.innerHTML = "CHOSEN ✓ <span aria-hidden=\"true\">→</span>";
      picked.textContent = `Chosen: ${option.number} · ${option.name}`;
      status.textContent = `Chosen: ${option.number} · ${option.name}. Tell Robert this is the one.`;
    });
    palettePicker.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") { event.preventDefault(); renderPalette(paletteIndex - 1); }
      if (event.key === "ArrowRight") { event.preventDefault(); renderPalette(paletteIndex + 1); }
    });
    paletteStage.addEventListener("pointerdown", (event) => { touchStartX = event.clientX; });
    paletteStage.addEventListener("pointerup", (event) => {
      if (touchStartX === null) return;
      const delta = event.clientX - touchStartX;
      touchStartX = null;
      if (Math.abs(delta) > 45) renderPalette(paletteIndex + (delta < 0 ? 1 : -1));
    });
    renderPalette(paletteIndex, false);
  }
})();
