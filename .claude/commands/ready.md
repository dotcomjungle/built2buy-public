---
description: Take work as far as this repository allows — committed on your own branch, verified, board card done — and hand it to a person. There is no /ship here.
---

# /ready

**There is no `/ship` command in this repository, and that is deliberate.**

Your job on this site stops at *committed on my own branch, ready for a person*.
You do not push, you do not open a pull request to publish, and you do not merge.
A person decides when something on the public site goes out.

## Why the push is blocked

This repository is **deliberately unregistered** in the tier registry at
`~/.claude/hooks/repo_tiers.json`. An unregistered repository hard-blocks at the
push guard, which is the registry's fail-safe: a repository can never fall through
to publish authority by being forgotten.

Steve classified this site Tier 1 on 2026-08-11 and it was **held out of the
registry on purpose**. The registry's own `_coverage_note` states the reason:
registering it would replace today's fail-safe hard block with direct-push
authority on a public, customer-facing site whose `main` carries no branch
protection, no ruleset and no required status check — the very wall the registry's
integrity note names as what makes Tier 1 safe. Verified against the GitHub API on
2026-09-07: `main` is still unprotected.

It stays unregistered until that rule exists. The Bridge board card is **A
pull-request rule guards the public site's main** (7624).

**What that means for you, concretely:**

- **A push here will hard-block with a guard message. That is the guard working.**
  It is not a bug, not a misconfiguration, and not something to diagnose.
- **Never edit `~/.claude/hooks/repo_tiers.json` to unblock yourself.** That file
  lives under `~/.claude/**`, which is agent-writable, so nothing stops the edit
  mechanically — which is exactly why the rule has to hold on its own. Editing it
  would hand this site direct-push authority by an agent's decision rather than a
  person's, and the registry's integrity note says plainly that it is not itself
  the wall.
- **Never route around the guard** by another remote, another checkout, a
  different tool, or a person's credentials.
- If the guard blocks you, **report the block with its exact message and stop.**

## What you do instead

### 1 — Before anything else

1. `git branch --show-current` — confirm you are on **your own** branch, cut from
   `origin/main`. This checkout stays on whatever branch the last session left it
   on; at the 2026-09-07 move it was sitting on `dax/strip-attribution-line`.
   Never commit onto a branch you do not own.
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

### 5 — Hand it over

Report, in one message:

- the branch name and the commit,
- what changed and which pages it affects,
- what you verified — the files through `tidy`, the links you resolved, the greps
  that returned nothing, the pages you opened and at which widths,
- the `publish-review` result,
- the board card, by title, and its state,
- and that the push is blocked by design and waits for a person.

Do not push. Do not open a pull request. Do not ask to be unblocked — say it is
ready and stop.
