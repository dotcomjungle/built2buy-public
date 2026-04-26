# built2buy-public

Permanent public-facing static site for Built2Buy crew deliverables. Anything published here is shareable with people who don't have a Bridge login (advisors, clients, contractors, programmers).

**Live URL:** https://built2buy-public.vercel.app
**GitHub:** https://github.com/dotcomjungle/built2buy-public
**Vercel team:** dotcomjungle

## Structure

- `index.html` — landing page listing all deliverables
- `deliverables/<slug>/index.html` — one folder per deliverable, served at `/deliverables/<slug>/`
- `vercel.json` — minimal Vercel config (static, no auth)

## Adding a new deliverable

1. Create `deliverables/<slug>/index.html` (slug ends with `-YYYY-MM-DD`)
2. Add a card to the index page linking to it
3. `git push origin main` — Vercel auto-deploys

Brand styling: Urbanist for headings, Inter for body, colors `#0693e3` cerulean / `#2DB68D` teal / `#111111` dark / `#8ed1fc` soft blue.

## What this is NOT

This is not for internal/sensitive content. The Bridge website (auth-gated) is the right home for anything that should not be public. This site exists for content explicitly intended to be shared outside the crew.
