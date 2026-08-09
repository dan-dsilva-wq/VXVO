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
})();
