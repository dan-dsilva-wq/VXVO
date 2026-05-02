# VXVO

Studio site. Static — no build step.

## Run locally

Pick one:

```powershell
# Option 1 — open the file directly
start index.html

# Option 2 — quick local server (recommended; lets fonts/CORS behave normally)
npx serve .
# or
npx http-server -p 5173 -o
```

## Deploy to Vercel

```powershell
npx vercel
# accept defaults, then:
npx vercel --prod
```

No framework, no build command, no install step needed. `vercel.json` adds long-cache headers for static assets.

## Files

- `index.html` — page
- `styles.css` — all styling
- `script.js` — reveal animations, parallax, count-up
- `logo.svg` — full wordmark
- `favicon.svg` — square mark
- `og.svg` — social share image
- `vercel.json` — caching headers
