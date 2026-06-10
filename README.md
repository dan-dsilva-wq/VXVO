# VXVO — The Demonstration Room

Studio site. Static — no framework, no build step, no tracking.

The site is a maker's demonstration room: every product is an exhibit, and eight of them
genuinely run in the page as hand-written vanilla-JS miniatures (speech, WebAudio,
procedural SVG, live-timed local search). Engraved plates state what's real vs. staged.

## Run locally

```powershell
# any static server works
python -m http.server 8347
# or
npx serve .
```

## Deploy to Vercel

```powershell
npx vercel --prod
```

`vercel.json` sets long-cache headers and a strict CSP (everything is same-origin:
fonts are self-hosted, no third-party requests at all).

## Files

- `index.html` — the whole room (semantic, fully readable without JS)
- `styles.css` — design system: chalk on machinists' enamel, Bricolage Grotesque + Spline Sans Mono
- `script.js` — engine room: RUN power bus, audio bus, eight working models
- `fonts/` — self-hosted variable woff2 (latin subsets)
- `media/` — production screenshots (Pace, Klaro)
- `favicon.svg` / `og.png` — square mark / social card (`og.html` is the og source; re-screenshot at 1200×630 after edits)
- `vercel.json` — caching + CSP headers
- `_archive/` — previous versions of the site (not linked)
- `concepts/` — older design explorations (not linked)

## Conventions

- International orange `#FF4F00` is reserved for the RUN switch and live signals — never decoration.
- Every demo carries an honesty label: "runs in your browser" vs. "demonstration data". Keep them true.
- Release notes live in the colophon ("Demonstration Room v1.x") — bump them when the room changes.
