---
name: publish-review
description: The pre-publication read for a site with no login and no recall — what must never appear on a public page, and the one test that decides whether a page belongs here or on the auth-gated Bridge. Use before committing any new page, any edit to an existing page, or any change to the landing page's list of deliverables.
---

# Before anything goes on the public site

**This site is a one-way door.** There is no login in front of it, no robots
exclusion anyone should rely on, and no way to recall a page once it has been
fetched, cached or indexed. Deleting a file later removes the page, not the copy
somebody already has.

That asymmetry is the whole reason this skill exists. A page held back for an hour
costs an hour. A page published wrongly cannot be unpublished.

## The test

**What happens if a competitor, a customer or an investor reads this out of
context?**

If the answer is not **"nothing"**, it does not go here. The Bridge website is
auth-gated and is the right home for it.

"Out of context" is the load-bearing half. A page that is fine beside the
conversation that produced it, and misleading on its own, fails this test. So does
a page that is accurate today and becomes a claim the moment the underlying thing
changes, because nobody will come back and update it.

**When in doubt, ask a person rather than publishing.** There is no version of
this where guessing is the cheaper option.

## What must never appear

Read the page for each of these before you commit it.

- **Customer or lead data of any kind.** A named contact, an email address, a
  phone number, a company in our pipeline, a lead count, a rep's name, a deal, a
  disposition, a screenshot of 10 Forward with real rows in it. None of it,
  including in a mock-up, a placeholder, or a demo image that was made from real
  data.
- **Internal URLs and identifiers.** Bridge website paths, Neon project ids
  (`dry-hill-…`, `gentle-bar-…`), `*.neon.tech` hosts, internal API routes,
  preview deployment URLs, Vercel project internals, GitHub repository paths for
  private work, Trello or board card links.
- **Credentials, in any form.** A key, a token, a connection string, a password, a
  webhook URL, a session cookie, a `.env` value — including one that has been
  rotated. Never in the markup, never in a comment, never in an inline script.
- **Pricing, terms or discounts that are not already public.** Rates, discount
  arrangements, contract terms, what a specific customer pays, when a rate
  changes. If it is not on https://built2buy.com already, it is not public.
- **Customers who are not already public**, and anything about a public customer
  beyond what has been cleared. Never invent a customer, never imply one, and
  never describe a prospect as a customer.
- **The attribution line.** "Ideated And Architected By Steve Rice For
  Dotcomjungle and Built2Buy." belongs in git commit messages and nowhere else.
  It was removed from this site deliberately; do not reintroduce it in a footer, a
  byline, a comment or a meta tag.
- **A crew byline or crew metadata.** No persona name prepended to prose, no
  "written by" naming a crew member, no `crewmate` or `teammate` meta tag. Those
  are Bridge conventions and they name our internal staffing to anyone who views
  source.
- **Internal process language.** Board card titles, sprint or epic names, review
  states, agent names, anything that describes how we work rather than what we
  sell.
- **Unverified figures.** A statistic on a public page is a public claim. If it
  does not trace to something you can point at, it is unknown — say so and ask.

## Customer canon, when a customer is named at all

If a page names a customer, it names them the way the company names them
everywhere:

- **Natural Earth Paint** — full name, always. Never "NEP" in anything a reader
  sees. They make natural, non-toxic art paints and kids' chalk paints.
- **Joey's Hot Sauce** and **Darex Industrial** are the other two. All three are
  live, paying customers.
- **Broken Top Candles is not a customer.**
- The legacy proof metrics — the 1,000-user launch, 110 hours a month saved, zero
  training calls — are **anonymised results from prior enterprise clients**, never
  attributed to a named current customer.
- **Never connect Built2Buy or Dotcomjungle to Delaware** in any form.
  Corporate-structure questions go to Steve or to Stewart Myers.
- **Gregory Petrossian is not named.** Say "the GTM framework".

## The mechanical pass, then the judgement pass

`/verify` § 3 carries the four greps that catch the attribution line, crew meta
tags, persona bylines and internal identifiers. Run those first — they are cheap
and they are the floor.

Then read the page as a stranger. The greps cannot catch a sentence that is true
internally and misleading publicly, a chart whose axis reveals a volume we have not
disclosed, a screenshot with a real name in the corner, or a claim that will be
wrong next quarter with nobody watching it. That reading is the work.

## Before you commit, say which

For the page as a whole, state one of:

- **Clear** — and name what you checked it against, not just that you checked.
- **Belongs on the Bridge instead** — and say which part made it so.
- **Needs a person** — and say exactly what you are unsure about, in one question.

A page that is none of the three does not get committed.
