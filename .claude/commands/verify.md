---
description: The checks that stand in for a test suite on a repository that has none — validity, links, leakage, and a real look at the rendered page.
---

# /verify

**There is nothing to run here, and that is the first thing to say in any report.**

This repository has no `package.json`, no test suite, no linter and no
`.github/workflows/` — `.github/` holds one file, `copilot-instructions.md`, and
nothing that executes. `main` carries no branch protection and no required status
check. Nothing automated will catch a mistake between your edit and a stranger
reading the page.

That is not an argument for skipping verification. It is the reason the checks
below are done by hand, every time, and reported by name. A report that says
"looks good" on a repository with no gate has told the reader nothing.

Run each in order. Collect every finding rather than stopping at the first.

## 1 — HTML validity

`tidy` is installed and read-only, and `.claude/settings.json` grants it so it
does not prompt. Run it against every page you touched:

```sh
tidy -q -e --gnu-emacs yes index.html
tidy -q -e --gnu-emacs yes deliverables/<slug>/index.html
```

`tidy` exits 0 on warnings, so read the output rather than the exit code. One
warning class is expected and is not a defect: the Google Fonts stylesheet URL
carries `&family=` and `&display=`, which `tidy` reports as "unescaped & or
unknown entity". Every other warning is yours to explain or fix. Never report a
page as clean while `tidy` is printing anything you have not named.

## 2 — Links

Extract every link and check it resolves. There is no link checker in this
repository, so this is a grep and a look:

```sh
grep -ho 'href="[^"]*"' index.html deliverables/*/index.html *.html | sort -u
```

For each result:

- **A fragment (`#id`)** — confirm an element with that id exists in the same file.
- **A local path** — `vercel.json` sets `cleanUrls: true` and `trailingSlash:
  false`, so `/deliverables/<slug>` is served from
  `deliverables/<slug>/index.html`. Confirm the file exists at that path. **A
  `.html` extension or a `/pages/` prefix in a link is wrong** and will read as
  broken.
- **An external URL** — `curl -sS -o /dev/null -w '%{http_code} %{url_effective}\n' -L <url>`.

Check the reverse direction too: every folder under `deliverables/` should be
linked from `index.html`. A deliverable nobody can reach is published and
invisible at the same time, which is the worst of both.

**Two known exceptions, as of 2026-09-07**, so this check is not red for a reason
nobody wrote down. `deliverables/built2buy-admin-redesign-wave-1-2026-04-25/` and
`deliverables/built2buy-admin-redesign-wave-2-2026-04-25/` are both on disk, both
reachable at their URLs by anyone who knows them, and neither is linked from
`index.html`. They predate this command. Whether they should be linked or removed
is a person's call — see the board card *Every page on the public site is either
linked from the index or gone*. Until that is decided these two are the expected
output; anything else this check reports is a real finding.

## 3 — Nothing internal leaked onto a public page

Everything here is world-readable the moment it is pushed. These four greps
should each return nothing across every page you are about to publish:

```sh
grep -rn "Ideated And Architected" --include='*.html' .
grep -rniE 'name="(crewmate|teammate)"' --include='*.html' .
grep -rniE '\b(Dax|Kira|Bellana|Saavik|Seven|Uhura|Troi|Guinan|Sato|Janeway|Nahla) says\b' --include='*.html' .
grep -rniE 'dry-hill-|gentle-bar-|neon\.tech|vercel\.app/api|postgres://|DATABASE_URL' --include='*.html' .
```

- **The attribution line** belongs in git commit messages and nowhere else. It
  was removed from this site deliberately; if you find one, take it out.
- **A `crewmate` or `teammate` meta tag** is a Bridge convention. Those tags
  belong on the auth-gated Bridge website. This site is not that site, and a
  crew name in a meta tag names our internal staffing to anyone who views source.
- **A crew-persona byline** — a name prepended to prose, a "written by" line
  naming a persona — does not go on a public page.
- **Internal identifiers** — project ids, Neon hosts, internal API paths,
  connection strings. None of them.

The full pre-publication read is the `publish-review` skill. Run it as well as
this command for anything new; these greps are the mechanical floor, not the
judgement.

## 4 — The rendered page

This is the check that replaces the test suite, so it is not optional and it is
not a screenshot of the desktop width.

Serve the site locally:

```sh
python3 -m http.server 8000
```

Deliberately not `npx --yes serve`: that downloads a package and runs its
lifecycle scripts, which is the action every settings file in this family
withholds from an agent on purpose. `python3` is already here and downloads
nothing.

**It will not reproduce `cleanUrls`.** `vercel.json` sets `cleanUrls: true` and
`trailingSlash: false`, so `/dials-to-deals-calculator` resolves on Vercel and
404s under a plain static server. Check layout and content locally; the
extensionless links are only genuinely proven on the deployed site, which a
person publishes. Say which of the two you checked.

Open every page you changed at a **desktop width and a phone width**, and say
which pages you opened and at which widths. Check the things nothing else here
can: headings render in Urbanist and body copy in Inter, the palette matches
https://built2buy.com rather than an improvised second style, nothing overflows
horizontally at phone width, and every image loads.

After a push, load the live URL — **https://built2buy-public.vercel.app** — and
confirm the change is actually there. A push is not a publish and a deploy is not
a rendered page.

## Reporting rules

- **Say that there is no automated gate.** Every report from this repository
  states it, because a reader who assumes a CI run happened will trust the result
  more than it deserves.
- **Name what you ran and what you looked at.** Which files through `tidy`, which
  links you resolved, which greps returned nothing, which pages at which widths.
- **A warning is a finding.** Name it, even when you are confident it is benign —
  say why it is benign rather than omitting it.
- **Say what is not proven.** No test asserts anything about this site. Everything
  above is you looking, and the report should read that way.
