# VXVO board-game storefront

Static, framework-free site for the trade-launch phase of VXVO, an occasion-led UK board-game retailer.

## Current state

- Supplier-viewable brand and retailer overview
- Opening-range briefs with no invented products, prices or stock
- Launch-state help, privacy, website terms, delivery/returns and accessibility pages
- Checkout intentionally disabled until stock, fulfilment, payment and public-address gates are complete
- No analytics, contact forms, accounts or third-party scripts

## Run locally

```powershell
python -m http.server 8347
```

Open `http://127.0.0.1:8347/`.

## Deployment

The repository is connected to the existing VXVO Vercel project. Feature branches create preview deployments. Production remains on the preserved software-site commit until the owner explicitly approves the domain cutover.

## Restore point

The former VXVO software site remains recoverable from Git commit `9047c1baa1df8a884cbae0720b034cc552e9ce7c` and its immutable Vercel deployment. A separate verified source archive is held in the Boardgames workspace.
