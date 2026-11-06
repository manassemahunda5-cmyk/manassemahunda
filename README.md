# Manasse Mahunda — Portfolio

Static portfolio website (HTML, CSS, JavaScript). There is no build step and no framework, so it deploys to Vercel as-is.

## Project structure

```
index.html              page markup
assets/
  css/style.css         all styles
  js/main.js            animations, notes board, footer physics
  js/matter.min.js      Matter.js 0.19.0 (physics engine, bundled locally, MIT licence)
  img/                  hero.webp, about.jpg, logo.jpg
  favicon.svg
vercel.json             headers and clean URLs
package.json            project metadata and a local dev script
robots.txt
```

Fonts (Anton, Manrope, DM Mono, Caveat, Reenie Beanie, Exo 2) load from Google Fonts.

## Run locally

```bash
npx serve .
```

Then open the address it prints. Opening `index.html` directly also works.

## Deploy: GitHub, then Vercel

1. Create an empty repository on GitHub (for example `manasse-portfolio`).
2. In this folder run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/manasse-portfolio.git
   git push -u origin main
   ```
3. Go to https://vercel.com/new and import the repository.
4. Leave every setting at its default: Framework Preset **Other**, no Build Command, no Output Directory (the project root is served).
5. Click **Deploy**. Every later push to `main` redeploys automatically.

## Things to update

- Social links in the footer (LinkedIn, X, Behance, Instagram) are placeholders (`href="#"`). Edit them in `index.html`.
- The four "Concept" projects in Selected Works are placeholders. Replace the titles and descriptions in `index.html`.
- Contact details (email, WhatsApp, phone) are in the Contact section and the footer WhatsApp icon.
- Once you have a domain, update the `og:image` in `index.html` to a full URL (`https://yourdomain.com/assets/img/about.jpg`) so link previews work.
