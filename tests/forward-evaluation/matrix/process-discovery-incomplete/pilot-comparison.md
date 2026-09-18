# Pilot process comparison — provisional (process inventory not supplied)

## What's missing

No process inventory, case data, volumes, owners, pain points or source documents were provided for this task, and the working directory contained no `provia-project.json` or supporting files to read them from. Country/jurisdiction was also not stated. Per plugin convention, Angola is disclosed here as the **provisional** starting context (language: English, currency AOA, timezone Africa/Luanda) — not a confirmed fact.

Because a real comparison cannot be built without real processes, this report does two things:

1. States the comparison **method and dimensions** you should apply.
2. Illustrates that method against three **placeholder candidate processes** — procurement, employee onboarding, and IT support requests — chosen only because they are common, repeatable back-office processes in a small/medium organization and match the kind of example this skill itself uses. **These are not your organization's actual processes.** Every characteristic below is a typical/generic pattern for that process type, not an observed fact about your organization. Substitute your real candidates and re-run the comparison before deciding anything.

## Comparison dimensions (apply these to your real candidates)

| Dimension | Question to answer with real data |
| --- | --- |
| Impact | What breaks or costs money/time when this process goes wrong or is slow? |
| Frequency | How many cases complete in a typical 4-week window? (Need enough to learn from — a handful of cases in a month teaches little.) |
| Handoff delay | Where does work sit waiting on a person, approval or external party? |
| Evidence gaps | What's currently undocumented — decisions made by email, missing approvals, no audit trail? |
| Ownership | Is there one named person/role who can own the pilot and keep it staffed for a month? |
| Implementation effort | How many steps, approval branches, systems and exception paths does it have? |

A good 4-week pilot scores well on frequency (enough completed cases to observe and adjust), has a named owner, and has modest implementation effort — even if it isn't the highest-impact process in the organization. High impact with low frequency or no owner is usually a second-wave candidate, not a first pilot.

## Illustrative comparison (placeholder data — not your organization's)

| Candidate | Typical impact | Typical frequency | Typical handoff delay | Typical evidence gaps | Typical ownership | Typical implementation effort |
| --- | --- | --- | --- | --- | --- | --- |
| IT support requests | Medium — user productivity lost while blocked | Usually high — many requests per week, so a 4-week pilot would likely see enough completed cases | Usually short — hours to a few days | Often informal (chat/email), rarely tracked end-to-end | Usually one clear owner (IT/helpdesk lead) | Usually low — request → triage → resolve → close, few approval branches |
| Procurement / purchase requests | Often high — spend control, supplier commitments | Varies — can be low for larger purchases, higher for routine small purchases | Often long — waits on approvals, quotes, supplier replies | Frequently weak — missing quotes, undocumented approval thresholds | Often split across requester, approver(s) and finance — ownership needs to be named, not assumed | Usually medium/high — multiple approval branches, thresholds to define first |
| Employee onboarding | High per case — compliance and first-day experience | Usually low, especially in a smaller organization — may not produce enough completed cases in 4 weeks to learn from | Often long — spans IT provisioning, HR, manager tasks over days/weeks | Often moderate — checklist exists but completion isn't tracked | Usually one clear owner (HR) | Usually medium — multi-step but mostly linear |

## Provisional recommendation and why

Using only the generic patterns above (not confirmed data), **IT support requests** is the type of process that typically fits a 4-week pilot best: enough recurring cases to generate real learning within the window, a single owner who can commit to it, low compliance stakes, and a simple enough flow to design and adjust quickly.

**Procurement** is often the higher-impact candidate, but it usually needs at least one prior decision resolved — who approves at which spend threshold — before it can even be scoped, and its frequency/effort profile is less certain without real volume data. It's a strong second-wave candidate, or a first pilot if your organization's procurement volume is actually high and a single owner is confirmed.

**Employee onboarding** is usually deprioritized for a *first* 4-week pilot specifically because of frequency: if your organization hires only a few people a month, four weeks won't produce enough completed cases to validate or adjust the design. It remains a good target once volumes are confirmed or for a longer pilot window.

If your organization's actual volumes contradict these generic assumptions — for example, if procurement cases are frequent and onboarding is not the low-frequency case here — the ranking changes accordingly. That is exactly the missing information in [[D1]]–[[D5]] below.

## Boundaries for the (provisional) pilot scope

- Start: a single, clearly defined trigger event for the chosen process (e.g., a request is submitted).
- End: a single, observable completion condition (e.g., request closed with an outcome recorded).
- Exclude: any variant or exception case that isn't yet well understood — fold those in after the first pilot review, not before.
- Review point: after a handful of real completed cases (not a fixed calendar date alone), so the review has something to learn from.

## Open decisions (see `provia-project.json` → `decisions[]`)

| ID | Question | Owner |
| --- | --- | --- |
| D1 | What are the organization's actual repeatable processes? | Process owner (unassigned) |
| D2 | What is the observed case volume/frequency for each candidate? | Process owner (unassigned) |
| D3 | Who is the named owner for each candidate process? | Operations lead (unassigned) |
| D4 | Confirm country, language, currency, timezone (Angola/en/AOA/Africa-Luanda used provisionally) | Project sponsor (unassigned) |
| D5 | What known pain points or evidence gaps exist in each candidate today? | Process owner (unassigned) |

## Artefacts produced

- `provia-project.json` — manifest recording the open decisions above and the provisional project context (no sources, groups, workflows or entity types yet — none exist to record).
- `project.html` — offline map view of the manifest (currently only the pending-items panel is populated).
- `setup.md` — generated handover listing the same open items.
