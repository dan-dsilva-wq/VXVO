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
    const total = document.querySelector("[data-palette-total]");
    const customPanel = document.querySelector("[data-custom-palette]");
    const customInputs = [...document.querySelectorAll("[data-custom-color]")];
    const customThemeProperties = ["--d-bg", "--d-sidebar", "--d-surface", "--d-line", "--d-ink", "--d-muted", "--d-muted-2", "--d-lime", "--d-sky", "--d-violet", "--d-amber", "--d-coral", "--d-glow", "--d-glow-2", "--d-sidebar-glass", "--d-topbar", "--d-card", "--d-score-card", "--d-reward-card", "--d-accent-soft", "--d-accent-wash", "--d-accent-ink", "--d-route-bg", "--d-row-bg", "--d-track", "--d-table-text", "--d-avatar-bg", "--d-avatar-ink", "--d-notice-bg", "--d-notice-line", "--d-status-neutral", "--d-status-neutral-bg", "--d-status-green", "--d-status-green-bg", "--d-status-sky", "--d-status-sky-bg", "--d-status-amber", "--d-status-amber-bg", "--d-violet-soft", "--d-sidebar-ink", "--d-sidebar-muted", "--d-sidebar-muted-2"];

    const hexRgb = (hex) => {
      const value = hex.replace("#", "");
      return { r: parseInt(value.slice(0, 2), 16), g: parseInt(value.slice(2, 4), 16), b: parseInt(value.slice(4, 6), 16) };
    };
    const rgbHex = ({ r, g, b }) => `#${[r, g, b].map((channel) => Math.round(channel).toString(16).padStart(2, "0")).join("")}`;
    const mixHex = (first, second, amount) => {
      const a = hexRgb(first); const b = hexRgb(second);
      return rgbHex({ r: a.r + (b.r - a.r) * amount, g: a.g + (b.g - a.g) * amount, b: a.b + (b.b - a.b) * amount });
    };
    const alphaHex = (hex, opacity) => { const { r, g, b } = hexRgb(hex); return `rgba(${r},${g},${b},${opacity})`; };
    const luminance = (hex) => {
      const { r, g, b } = hexRgb(hex);
      const channels = [r, g, b].map((channel) => channel / 255).map((channel) => channel <= .03928 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4);
      return .2126 * channels[0] + .7152 * channels[1] + .0722 * channels[2];
    };
    const readableOn = (hex) => luminance(hex) > .45 ? "#111111" : "#ffffff";
    const readCustomValues = () => Object.fromEntries(customInputs.map((input) => [input.dataset.customColor, input.value.toLowerCase()]));
    const clearCustomTheme = () => { customThemeProperties.forEach((property) => root.style.removeProperty(property)); root.style.removeProperty("color-scheme"); };
    const updateCustomValueLabels = (values) => Object.entries(values).forEach(([key, value]) => { const label = document.querySelector(`[data-custom-value="${key}"]`); if (label) label.textContent = value.toUpperCase(); });

    paletteTabs.innerHTML = paletteOptions.map((option) => `<button class="demo-palette-tab" type="button" role="tab" data-palette-tab="${option.id}" aria-selected="false" aria-label="View ${option.number} ${option.name}"><b>${option.number}</b><span>${option.name}</span><i class="demo-palette-tab-colours" aria-hidden="true">${option.palette.map((colour) => `<i style="--swatch:${colour}"></i>`).join("")}</i></button>`).join("");

    const renderPalette = (nextIndex, announce = true) => {
      paletteIndex = (nextIndex + paletteOptions.length) % paletteOptions.length;
      const option = paletteOptions[paletteIndex];
      clearCustomTheme();
      root.dataset.palette = option.id;
      customPanel?.classList.remove("custom-active");
      position.textContent = option.number;
      total.textContent = "/ 10";
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

    const applyCustomPalette = () => {
      const values = readCustomValues();
      const { primary, secondary, ink, canvas } = values;
      const canvasIsLight = luminance(canvas) > .45;
      const surface = canvasIsLight ? mixHex(canvas, "#ffffff", .72) : mixHex(canvas, "#ffffff", .12);
      const surfaceAlt = mixHex(surface, canvas, .35);
      const sidebarInk = readableOn(ink);
      const sidebarMuted = mixHex(sidebarInk, ink, .48);
      const sidebarMuted2 = mixHex(sidebarInk, ink, .3);
      const accentInk = readableOn(primary);
      root.dataset.palette = "custom";
      root.style.setProperty("color-scheme", canvasIsLight ? "light" : "dark");
      root.style.setProperty("--d-bg", canvas);
      root.style.setProperty("--d-sidebar", ink);
      root.style.setProperty("--d-surface", surface);
      root.style.setProperty("--d-line", alphaHex(ink, .17));
      root.style.setProperty("--d-ink", ink);
      root.style.setProperty("--d-muted", mixHex(ink, canvas, .52));
      root.style.setProperty("--d-muted-2", mixHex(ink, canvas, .34));
      root.style.setProperty("--d-lime", primary);
      root.style.setProperty("--d-sky", secondary);
      root.style.setProperty("--d-violet", secondary);
      root.style.setProperty("--d-amber", secondary);
      root.style.setProperty("--d-coral", primary);
      root.style.setProperty("--d-glow", alphaHex(primary, .16));
      root.style.setProperty("--d-glow-2", alphaHex(secondary, .1));
      root.style.setProperty("--d-sidebar-glass", alphaHex(ink, .97));
      root.style.setProperty("--d-topbar", alphaHex(canvas, .92));
      root.style.setProperty("--d-card", `linear-gradient(145deg, ${surface}, ${surfaceAlt})`);
      root.style.setProperty("--d-score-card", `linear-gradient(145deg, ${mixHex(surface, primary, .12)}, ${surface})`);
      root.style.setProperty("--d-reward-card", `linear-gradient(155deg, ${mixHex(surface, secondary, .12)}, ${surface})`);
      root.style.setProperty("--d-accent-soft", alphaHex(primary, .14));
      root.style.setProperty("--d-accent-wash", alphaHex(primary, .12));
      root.style.setProperty("--d-accent-ink", accentInk);
      root.style.setProperty("--d-route-bg", alphaHex(ink, .06));
      root.style.setProperty("--d-row-bg", alphaHex(ink, .05));
      root.style.setProperty("--d-track", mixHex(canvas, ink, .2));
      root.style.setProperty("--d-table-text", mixHex(ink, canvas, .22));
      root.style.setProperty("--d-avatar-bg", mixHex(ink, primary, .35));
      root.style.setProperty("--d-avatar-ink", readableOn(mixHex(ink, primary, .35)));
      root.style.setProperty("--d-notice-bg", alphaHex(secondary, .09));
      root.style.setProperty("--d-notice-line", alphaHex(secondary, .24));
      root.style.setProperty("--d-status-neutral", mixHex(ink, canvas, .48));
      root.style.setProperty("--d-status-neutral-bg", alphaHex(ink, .06));
      root.style.setProperty("--d-status-green", readableOn(primary) === "#ffffff" ? mixHex(primary, "#ffffff", .4) : mixHex(primary, ink, .25));
      root.style.setProperty("--d-status-green-bg", alphaHex(primary, .12));
      root.style.setProperty("--d-status-sky", readableOn(secondary) === "#ffffff" ? mixHex(secondary, "#ffffff", .35) : mixHex(secondary, ink, .2));
      root.style.setProperty("--d-status-sky-bg", alphaHex(secondary, .12));
      root.style.setProperty("--d-status-amber", readableOn(secondary) === "#ffffff" ? mixHex(secondary, "#ffffff", .35) : mixHex(secondary, ink, .2));
      root.style.setProperty("--d-status-amber-bg", alphaHex(secondary, .12));
      root.style.setProperty("--d-violet-soft", alphaHex(secondary, .25));
      customPanel?.classList.add("custom-active");
      palettePicker.classList.remove("picked");
      pickedPalette = null;
      position.textContent = "DIY";
      total.textContent = "/ custom";
      descriptor.textContent = "Your own four-colour system";
      name.textContent = "Custom palette";
      why.textContent = "Your colours are live on the Home page now. Keep adjusting the four core tones until the dashboard feels right.";
      current.textContent = "Custom palette";
      swatches.innerHTML = [primary, secondary, ink, canvas].map((colour) => `<i style="--swatch:${colour}" title="${colour}" aria-label="${colour}"></i>`).join("");
      paletteTabs.querySelectorAll("[data-palette-tab]").forEach((tab) => { tab.setAttribute("aria-selected", "false"); tab.tabIndex = -1; });
      picked.textContent = "Viewing ";
      const customLabel = document.createElement("b"); customLabel.textContent = "Custom palette"; picked.append(customLabel);
      pickButton.innerHTML = "THAT ONE! <span aria-hidden=\"true\">→</span>";
      status.textContent = "Custom palette live — change any swatch to keep exploring.";
      updateCustomValueLabels(values);
    };

    paletteTabs.querySelectorAll("[data-palette-tab]").forEach((tab) => tab.addEventListener("click", () => renderPalette(paletteOptions.findIndex((option) => option.id === tab.dataset.paletteTab))));
    document.querySelector("[data-palette-prev]")?.addEventListener("click", () => renderPalette(paletteIndex - 1));
    document.querySelector("[data-palette-next]")?.addEventListener("click", () => renderPalette(paletteIndex + 1));
    customInputs.forEach((input) => input.addEventListener("input", applyCustomPalette));
    pickButton?.addEventListener("click", () => {
      const option = paletteOptions[paletteIndex];
      const custom = root.dataset.palette === "custom";
      pickedPalette = custom ? "custom" : option.id;
      palettePicker.classList.add("picked");
      pickButton.innerHTML = "CHOSEN ✓ <span aria-hidden=\"true\">→</span>";
      picked.textContent = custom ? "Chosen: Custom palette" : `Chosen: ${option.number} · ${option.name}`;
      status.textContent = custom ? "Chosen: your custom palette. Tell Robert this is the one." : `Chosen: ${option.number} · ${option.name}. Tell Robert this is the one.`;
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
