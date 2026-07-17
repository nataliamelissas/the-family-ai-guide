# The Family AI Guide

The website for [The Family AI Guide](https://thefamilyaiguide.substack.com), helping parents and families navigate AI with curiosity instead of fear.

Built with React, TypeScript, and Vite. Deployed to GitHub Pages.

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
```

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Fetch the latest posts, type-check, and build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run the test suite |
| `npm run lint` | Lint |
| `npm run format` | Format with Prettier |
| `npm run fetch:substack` | Refresh the posts snapshot from the Substack feed |

## How content works

There are three kinds of content, and they update differently.

### Posts (automatic)

Posts come from the Substack RSS feed. `scripts/fetch-substack.mjs` runs automatically before every build and writes `src/content/generated/posts.json`. You never edit that file by hand.

Excerpts use each post's Substack **subtitle**. If a post has no subtitle, the excerpt falls back to the opening of the body with the byline stripped. So the best way to control how a post reads on the homepage is to write a good subtitle in Substack.

#### Why there are two feed sources

Substack sits behind Cloudflare, which serves GitHub Actions IP ranges a JS challenge that CI can't solve. **Every direct fetch from a GitHub runner gets a 403**, no matter what headers it sends. This was verified from a runner: a browser User-Agent doesn't help, and Substack's JSON API and sitemap are blocked too. Unrelated Substack publications are blocked as well, so this isn't specific to us.

The script therefore tries sources in order:

1. **The Substack feed directly.** Works from a normal network, so this is what runs on your machine.
2. **[rss2json](https://rss2json.com)**, which reads the same public feed from an address Cloudflare doesn't challenge. This is what actually runs in CI.
3. **The committed snapshot**, if both fail. The deploy still succeeds with slightly older posts.

`posts.json` records which source produced it in its `source` field.

Whenever the build falls back, it prints a GitHub **warning annotation** on the run. That matters: a silent fallback looks exactly like success while the site quietly stops updating. If you see `Could not refresh posts` on a run, the homepage is serving stale posts and needs attention.

Both sources are mapped to identical output, and a test enforces that, so readers can't tell which one was used.

### Notes (manual)

Substack publishes no API or RSS feed for Notes, so the featured note cannot be automated. Update it by editing `body` and `publishedAt` in `src/content/latestNote.ts`. Everything else links out to the Substack profile.

### Events (manual)

Edit `src/content/events.ts`. `location` and `registrationUrl` render only when set, so leave them `null` until confirmed.

## Editing the site

Almost all copy lives in a few files. You shouldn't need to touch components to change wording.

| What | Where |
| --- | --- |
| Site name, tagline, mission, email, Substack links | `src/config/site.ts` |
| Founder bios, photos, About intro | `src/content/founders.ts` |
| Events | `src/content/events.ts` |
| Featured note | `src/content/latestNote.ts` |
| Colors, fonts, spacing | `src/styles/tokens.css` |

Colors, type, and spacing are all CSS custom properties in `tokens.css`. Change them there and the whole site follows.

### Founder photos

Photos live in `src/assets/founders/` and are imported in `src/content/founders.ts`. Import them rather than linking into `public/`, so Vite rewrites the URLs for the deploy path and adds cache-busting hashes.

Keep them square and around 320x320. To swap one in:

```bash
python -c "
from PIL import Image, ImageOps
img = ImageOps.exif_transpose(Image.open('new-photo.jpg'))
img = ImageOps.fit(img, (320, 320), method=Image.LANCZOS, centering=(0.5, 0.4)).convert('RGB')
img.save('src/assets/founders/name.jpg', 'JPEG', quality=85, optimize=True)
"
```

This also strips EXIF metadata, which can contain camera and GPS data you don't want on a public site.

Set `photoUrl` to `null` for a founder and their initials render instead.

## Deploying

Every push to `master` builds and deploys automatically via `.github/workflows/deploy.yml`. You can also trigger a deploy by hand from the repo's **Actions** tab ("Run workflow").

### The refresh schedule

New Substack posts don't trigger a deploy on their own, so the workflow also runs on a schedule to pull them in:

```
- cron: "35 1-9 * * 5"
```

GitHub cron is **UTC only** and has no timezone support. That line runs hourly at :35 from Friday 01:35 to 09:35 UTC, which is **Thursday 7:35pm through Friday 3:35am Mountain** (an hour earlier during standard time, Nov to Mar).

This covers the whole Thursday-night publishing window, so a post published late still appears within the hour. Scheduled runs are best-effort and GitHub may delay them by 5 to 15 minutes under load; the hourly window absorbs that.

To change it, edit the cron and remember it's UTC: Mountain Daylight Time is UTC-6, Mountain Standard Time is UTC-7.

### First-time Pages setup

In the repo: **Settings > Pages > Build and deployment > Source** and choose **GitHub Actions**.

### Custom domain (Squarespace)

The site is built for whatever URL Pages serves it from, so it works at `nataliamelissas.github.io/the-family-ai-guide/` with no changes. To move it to a custom domain:

1. In the repo: **Settings > Pages > Custom domain**, enter the domain, and save. This commits a `CNAME` file.
2. In Squarespace DNS, for an apex domain (`thefamilyaiguide.com`) add four `A` records pointing to:
   `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
3. For a subdomain (`www`), add a `CNAME` record pointing to `nataliamelissas.github.io`.
4. Wait for DNS to propagate, then enable **Enforce HTTPS**.

Once the custom domain is set, Pages serves from the root and the build picks that up automatically.

## Notes on a couple of decisions

**Routing uses `HashRouter`** (URLs look like `/#/about`). GitHub Pages serves static files with no rewrite rules, so a normal router would 404 when someone refreshes or deep-links a page. The hash keeps routing entirely client-side and reliable.

**In-page scrolling uses click handlers, not `#id` anchors,** because `HashRouter` reserves the URL hash for routing.

## Outstanding TODOs

- Katherine's and Natalia's LinkedIn URLs (`src/content/founders.ts`). The link renders only once set.
- The featured note in `src/content/latestNote.ts` is seeded with a June note. Replace it with a current one.
- Event venue and registration link (`src/content/events.ts`).
