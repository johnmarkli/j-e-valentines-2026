# J + E Valentine’s Day 2026 Gallery

A lightweight static photo-story web app (no build step), ready for GitHub Pages.

## Local preview

From this directory:

```bash
python3 -m http.server 8080
```

Then open: `http://localhost:8080`

## Live site

[https://johnmarkli.github.io/j-e-valentines-2026/](https://johnmarkli.github.io/j-e-valentines-2026/)

## Keep images on a dedicated `assets` branch

This repo is configured to load image paths from jsDelivr pointing at the `assets` branch:

- `https://cdn.jsdelivr.net/gh/johnmarkli/j-e-valentines-2026@assets/...`

So `data/photos.json` can keep relative paths like `public/media/full/...`, while `app.js` rewrites those to the CDN URL at runtime (and keeps local relative paths on `localhost` for local preview).

### Recommended branch workflow

1. Commit and push code-only files on `main` (no `public/media/*`).
2. Create and switch to an orphan `assets` branch:

```bash
git checkout --orphan assets
```

3. Keep only image assets on that branch (`public/media/full`, `public/media/thumbs`) and commit.
4. Push both branches:

```bash
git push -u origin main
git push -u origin assets
```

5. Switch back to `main` for normal development.

If you replace photos later, update and push only the `assets` branch.

## Content structure

- `index.html` — page layout
- `styles.css` — styling
- `app.js` — rendering + interactivity
- `data/photos.json` — chapter/story/caption data
- `public/media/full` — full-size images/videos
- `public/media/thumbs` — optimized thumbnails

To update story text or order, edit `data/photos.json`.
