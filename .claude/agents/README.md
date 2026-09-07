# Standing up a repository-owned agent

`built2buy-public.md` beside this file is the agent definition for this
repository. This document is the part that is *not* in it: which lines are the
pattern and which are this repository, and the things that break on the next
instance because they were invisible on this one.

Do not copy the agent file wholesale. Read it, then write yours.

---

## The naming contract

The agent is named after the directory its repository lives in, and the name is
load-bearing in five places at once:

| Where | What it must be |
| --- | --- |
| The file | `.claude/agents/<directory-name>.md`, inside the repository |
| The frontmatter | `name:` equal to the directory name, exactly |
| The board | `owner_ref` on every card it owns, with `owner_kind = 'crew'` |
| Session records | `crew_name` in `crew_activity`, and `--crew` when publishing |
| The published page | `public/pages/sessions/<name>-YYYY-MM-DD.html` on the Bridge |

They must all agree. **`owner_kind` is `'crew'`, never `'agent'`** — the database
refuses `'agent'`, and a card with an empty `owner_ref` is invisible on the board
rather than unassigned. The board will not accept an owner name that has never
held a session, so on a first run the session row is written **before** any card
is filed.

A name is lowercase, starts with a letter, and holds only letters, digits and
hyphens — the website parses it back out of a filename, so both ends must agree.
The check that accepts a name as a session identity is `is_session_identity` in
`~/.claude/hooks/lib_crew_db.py`; the path rules that decide which directories may
claim one are in `lib_crew.detect_repo_agent`.

**The repository has to live in the right place.** Identity is detected from the
working directory against a list of approved parent folders —
`/Users/mac/wordpress-plugins/`, `/Users/mac/wordpress-themes/`, `/Users/mac/sites/`
and `/Users/mac/worker-agents/`. A repository anywhere else gets no agent
identity, cannot record a session, and cannot publish one. This repository moved
out of the crew tree on 2026-09-07 for exactly that reason.

**Renaming the directory changes the identity.** Past pages keep the old name and
nothing links the two. Rename deliberately or not at all.

**The agent's name stays off the site.** The identity above is a Bridge
convention: the board, the activity table, the session page. This repository
publishes to the open web, so an agent name, a crew persona byline or a
`crewmate` / `teammate` meta tag on a page here leaks internal staffing to anyone
who views source. That is the one place where a repository agent's name is
load-bearing by its *absence*, and `/verify` greps for it.

## The registry hold, and why there is no `/ship`

`~/.claude/hooks/repo_tiers.json` maps each repository to its tier. An
**unregistered repository hard-blocks on push** — the registry's fail-safe, so a
new repository can never fall through to publish authority by being forgotten.

For most new instances that block is a startup nuisance a person clears in a
minute. **Here it is the design.** Steve classified this site Tier 1 on
2026-08-11 and it was deliberately held out of the registry: registering it would
replace the hard block with direct-push authority on a public, customer-facing
site whose `main` carries no branch protection, no ruleset and no required status
check — the very wall the registry's own integrity note names as what makes Tier 1
safe. Verified against the GitHub API on 2026-09-07: `main` is still unprotected.
The hold lifts when the board card **A pull-request rule guards the public site's
main** (7624) is done, and not before.

So this repository has no `/ship` command. It has `/ready`, and the agent's job
ends at *committed on my own branch, ready for a person*. The registry file is
agent-writable, which is exactly why the instructions have to say plainly that it
is never edited to unblock a push.

**When you write the next instance, check its default branch rather than reading
its tier:**

```sh
gh api repos/<org>/<repo>/branches/main/protection
```

Write down what you found, with the date. The siblings all differ:
`investor-data-room` genuinely requires a pull request and a passing `Validate`
check; `sales-cms` has no protection and no required check while its instructions
still call it Tier 1; this one has no protection and is held unregistered so the
guard blocks instead. Three repositories, three answers, one tier name.

## What is this repository, and what is the pattern

Everything in the agent file is one or the other. When you write yours:

**Replace, always** — the agent name, the absolute working-tree path, the
`owner_ref`, the site's own rules (here: `cleanUrls` and the extensionless link
form, the deliverables folder layout, the brand fonts and palette, the
world-readable warning), the command list, and the tier and publish path.

**Keep, as pattern** — the scope section's shape (working tree, plus a short
closed list of what is legitimately outside it), the Bridge identity section, the
deferral to `CLAUDE.md` for anything repository-specific, the review gate,
delegation routing, and the reporting rules.

**Never restate a rule that lives somewhere else.** An early draft of an agent
file in a sibling repository paraphrased `CLAUDE.md` on branch topology and
drifted from it within a day, in the direction that mattered: the summary said one
thing, the source said the opposite, and the summary is what loads first. Point at
the home; do not summarise it. Here that discipline shows up as `/verify` owning
the mechanical greps and `publish-review` owning the judgement, each pointing at
the other rather than carrying a copy.

## A repository with no gate needs more prose, not less

The obvious reading of "no tests, no linter, no CI" is that there is less to write
down. It is the opposite. On a repository with a suite, an instruction that is
wrong gets caught by something. Here, every rule is enforced by an agent reading
it and choosing to follow it, and the only feedback loop is a stranger reading the
published page.

Two consequences for the next instance of this kind:

- **The verify command has to admit it is a checklist, not a gate**, in its first
  line. An agent that reports "verified" from a repository with no pipeline, in
  the same words it would use where a suite ran, has misled the reader without
  saying anything false.
- **The judgement check is the real check.** `publish-review` exists because a
  grep cannot catch a sentence that is true internally and misleading publicly, a
  screenshot with a real name in the corner, or a figure that will be wrong next
  quarter with nobody watching it.

## What the prose cannot enforce

The rules in `CLAUDE.md`, in an agent file and in a command are honoured, not
enforced. What actually blocks a mistake lives outside the repository, on one
machine, in `~/.claude/hooks/` — the push, merge and branch guards, the
CI-workflow guard, the credential gate, the content scanner that keeps the
attribution line out of rendered HTML, and the board-move guard. A reader of this
repository cannot tell an enforced rule from an honour-system one.

**Write the repository's rules as if nothing enforces them.** Here that is very
nearly literal: the push guard is the single mechanical protection this site has,
it exists on one machine, and everything else — what goes on a page, what stays
off it, whether anyone looked at the rendering — is honour system. On a machine
without those hooks, nothing at all stops a push straight to an unprotected public
`main`.

## The permission file is repository-local on purpose

`.claude/settings.json` is committed, and it holds this repository's grants so they
do not prompt. That looks like the drift the global rules warn about, and it is
not: the rule there is about `settings.local.json`, a private per-folder file
accumulating grants nobody else can see. This is the opposite — it is in version
control, every clone gets the same grants, and a reviewer can read it.

There is no build or test step here, so the grants are read-only git inspection
plus `node generate-commission.mjs`. Keep it that way: the shortest grant list
that lets the work happen is the one a reviewer will actually read. **A near-miss
silently prompts rather than erroring**, and an entry without a trailing `:*`
matches that exact command only. An open `git fetch` wildcard is deliberately
absent, because git's `ext::` transport turns a fetch url into a command.

## One instruction file, several tools, and the symlink caveat

`AGENTS.md` is a symlink to `CLAUDE.md`, and `.github/copilot-instructions.md`
carries the same rules, so every tool gets one set that cannot drift. Copy the
idea; know what it costs.

A symlink is stored in git as a small blob holding the target path, and it only
becomes a link when something recreates it on checkout. Two places that do not:
**Windows checkouts without symlink support**, where git writes a plain text file
containing `CLAUDE.md` — ten bytes where the rules should be, read by the tool,
which finds no instructions and says nothing; and **GitHub's own web interface**,
which renders the target path rather than following it. That second one matters
for `.github/copilot-instructions.md` specifically, because Copilot on github.com
reads the repository through that surface.

If every contributor is on macOS or Linux and the agents are local, symlinks are
the right answer and this is a footnote. If either is untrue, generate the copies
in a script and add a test asserting they match.

## Two things that do not survive a fresh clone

- **The branch the checkout is sitting on.** A shared checkout stays on whatever
  branch the last session left it on — at the 2026-09-07 move this one was on
  `dax/strip-attribution-line`. Run `git branch --show-current` before any
  `git add`, every time, and never commit onto a branch you do not own.
- **Any local tooling the verify checklist assumes.** `tidy` and `npx serve` are
  machine state, not repository state. A clone on another machine has neither, and
  the checklist silently becomes shorter rather than failing. Name the tool and
  the fallback where one exists.

## Where the numbers live

Do not put a measured figure or a branch-protection state in an agent file or in
this one without the date you checked it. They go stale, and a stale fact in a
file that loads first reads as a claim rather than a snapshot. Every claim in this
document about the tier registry and about `main` carries 2026-09-07 for that
reason — re-check them rather than inheriting them.
