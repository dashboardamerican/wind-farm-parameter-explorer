# Wind Farm Parameter Explorer

Interactive dashboard for exploring wind farm power curve parameters (rated speed Vr, curve exponent n) and their effect on matching score accuracy.

**Live**: https://dashboardamerican.github.io/wind-farm-parameter-explorer/

## Development

```bash
npm install
npm run dev        # http://localhost:3001
npm run build
npm run preview
```

## Deployment

Pushes to `main` trigger a GitHub Actions workflow that builds the Vite app and publishes `dist/` to GitHub Pages. See `.github/workflows/deploy.yml`.

The `base` path in `vite.config.js` must match the repo name (`/wind-farm-parameter-explorer/`) for assets to resolve correctly on Pages.

## Stack

React 18 + Vite + Recharts.
