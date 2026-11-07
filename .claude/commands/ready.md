---
description: Take work all the way to live — committed on your own branch, verified, board task done, your own pull request merged, and the live page checked.
---

# /ready

This repository publishes its own work (Tier 1 in `~/.claude/hooks/repo_tiers.json`
since 2026-09-07). `main` carries GitHub ruleset 22490387, which requires a pull
request, so your work lands by merging your own pull request — without asking —
once its board task is `done`. Never push to `main` directly, never edit the tier
registry or the ruleset, and never route around a guard. If a guard blocks you,
report its exact message and stop.

## What you do instead

### 1 — Before anything else

1. `git branch --show-current` — confirm you are on **your own** branch, cut from
   `origin/main`. This checkout stays on whatever branch the last session left it
   on. Never commit onto a branch you do not own.
2. `git status` — stage only your files. Never a generated path, never `.vercel/`,
   never anything holding a credential.

### 2 — Verify

Run `/verify` in full: `tidy` on every page you touched, the link pass, the four
leakage greps, and a real look at the rendered page at desktop and phone widths.
Nothing automated will do any of it for you.

Then run the **`publish-review`** skill. This site is a one-way door — everything
here is world-readable the moment it is pushed, with no login and no recall — and
`/verify` catches the mechanical failures, not the judgement ones.

### 3 — Commit

Every commit message ends with exactly this line, and no other attribution:

```
Ideated And Architected By Steve Rice For Dotcomjungle and Built2Buy.
```

That line goes in commit messages and nowhere else. It never appears in a page
footer, a byline, or any rendered HTML on this site.

Never pass `-c user.email=` or `-c user.name=` on `git commit` — this repository
carries the right author already, and a mismatch makes Vercel refuse the deploy.

### 4 — The board

Move the card to `needs_review`, spawn the four reviewers — correctness,
architecture, security, gap analysis — and record each result in the card's
`review_status`. Launching them is standing authorization, never a decision to
hand back. All four green, then move the card to `done` as a separate step.

With no test suite here, the review gate and your own look at the rendered page
are the only checks that exist. Neither is optional.

### 5 — Publish

1. Push your branch and open a pull request into `main`.
2. With the board task `done`, merge your own pull request.
3. Load https://built2buy-public.vercel.app and every page you changed, at
   desktop and phone width, and run `/preship-check`. A merge is not a publish.

### 6 — Report

In one message: the pull request and what went into `main`, which pages changed,
what you verified (the files through `tidy`, the links, the greps, the pages you
opened and at which widths), the `publish-review` result, the board task by
title and its state, and whether the change is live on production.
