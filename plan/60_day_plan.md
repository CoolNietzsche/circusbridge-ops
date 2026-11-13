# Circus Bridge: 60-Day Restart Plan
**Mon 16 Nov 2026 → Thu 14 Jan 2027** · Solo operator, about **5 hours a week** · Automate everything that isn't a relationship.

## Goal for day 60
1. **Circus Bridge acts are in at least 3 international agencies' rosters** (the wholesale channel).
2. **At least 1 paid booking** (a local Addis gig counts) **and at least 1 international offer or hold** (a dated, priced inquiry).
3. Sales kit live: showreel, act sheets, rate card, agency one-pager.
4. **Troupe product** in place through a Circus Ethiopia partnership.

## Who does what
| You (relationships, approvals) | Claude (writing, systems, research) |
|---|---|
| Calls and DMs with artists and Circus Ethiopia | All copy: emails, act sheets, one-pagers, proposals, captions, image prompts |
| Collect footage and passport info | Showreel edit plan (shot list + timings); can cut it with ffmpeg if you upload clips |
| Approve outreach batches (10 min) | Prospect research and contact verification |
| Take calls with buyers | n8n workflows (JSON to import) + exact VPS commands |
| Perform local gigs / attend showcases | Weekly batch of applications and follow-ups for you to approve |

## Tool stack: simplified
| Need | Use | Why |
|---|---|---|
| IG + FB scheduling | **Meta Business Suite** (free, native) | Replaces Postiz/Mixpost. **Postiz is parked.** |
| LinkedIn scheduling | LinkedIn's native scheduler | Free |
| Pipeline / CRM | **One Google Sheet** (tabs: Agencies, Castings, Artists, Bookings) | n8n reads and writes it easily; nothing to maintain. SuiteCRM is parked until there's real volume. |
| Automation | **Google Apps Script** for the radar + intake form (free, HTTPS, no server); n8n only for outreach email later | See automations A1–A4 below |
| Sending email | `circuscr@circusbridge.pro.et` via SMTP from n8n, **max 20 a day** | New mailbox: warm it up slowly |
| Forms (artist intake, booking inquiry) | Tally.so (free) → n8n webhook | Quicker than building a website first |
| Graphics | Canva + Gemini prompts | As before |

## Automations (build order)
- **A1 Casting Radar.** Every morning, n8n checks circus/variety casting boards (StageLync/CircusTalk, Entertainers Worldwide, Rising Stars, Circus Guide), filters on our keywords (juggling, balance, ladder, rolla bolla, acrobat, African, troupe, Gulf, Turkey, cruise) and emails you **one digest**. Each match is added to the *Castings* tab. *Saves you hours of browsing; you only approve.*
- **A2 Outreach Sequencer.** You mark a row in *Agencies* as `ready`. n8n sends email 1, then follow-ups on day 4, 7 and 14, and **stops automatically when they reply** (it checks the inbox by IMAP). Max 20 sends a day.
- **A3 Inbound Catcher.** A booking-inquiry form or an email to the mailbox → row in the Sheet → polite auto-reply with the showreel link → a notification to your phone (Telegram, free).
- **A4 Artist Intake.** One Tally form link that you paste in reply to every artist DM (video links, act, passport, experience, fee) → *Artists* tab → auto-thank-you. **This replaces most of the 9 DM templates.**
- *(Later)* A5 Weekly report: Sheet stats emailed every Monday.

## Week by week
| Week | Dates | Focus | You (~5 h) | Claude |
|---|---|---|---|---|
| **1** | 16–22 Nov | **Foundation** | Confirm stage names (Nahom!). Send the footage-request DM to Yoni, Nahom, Nati + 5–10 strong IG artists. Send the Circus Ethiopia message. Fill the passport matrix. | Act sheets ×3, agency one-pager, draft rate card, Circus Ethiopia proposal, Tally form questions, Google Sheet template |
| **2** | 23–29 Nov | **Showreel + radar** | Upload footage. Create Circus Bridge profiles on StageLync/CircusTalk and Entertainers Worldwide. Meet Circus Ethiopia. | Showreel edit (90–120 s) + per-act clips; n8n **A1 + A4**; verified list of 30 agencies (Gulf, cruise, resort) |
| **3** | 30 Nov–6 Dec | **Outreach wave 1: Gulf** | Approve 10 Gulf agency emails. Apply to the radar's top castings. Pitch 5 Addis hotels for Christmas/NYE/Genna/Timkat. | n8n **A2 + A3**; emails; hotel pitch; IG/FB posts batched for 2 weeks |
| **4** | 7–13 Dec | **Wave 2: cruise and resort agencies** | Approve 10 emails. Take any calls. Agree terms with Circus Ethiopia (MOU). | Cruise/resort agency emails; MOU draft; troupe act sheet |
| **5** | 14–20 Dec | **Troupe product + local gig** | Film the Circus Ethiopia troupe (phone, steady, wide). Do any local gig and film it. | Troupe reel; local-gig content; follow-ups (automatic) |
| **6** | 21–27 Dec | **Holiday low** | 1 h: reply to anything warm | Batch January content; prepare the Eid and resort-season pitch |
| **7** | 28 Dec–3 Jan | **Wave 3: Eid al-Fitr (≈9 Mar) Gulf + Turkey/Egypt resort season (Apr–Oct)** | Approve 10–15 emails | Emails, casting applications |
| **8** | 4–10 Jan | **Wave 4: cruise summer 2027 castings** | Approve emails. Genna (7 Jan) gig if booked. | Applications; Timkat gig content |
| **9** | 11–14 Jan | **Review** | 1 h review call with Claude | Scorecard + next 60-day plan |

## KPIs (tracked automatically in the Sheet)
| Metric | Day 30 | Day 60 |
|---|---|---|
| Agencies contacted | 20 | 45 |
| Castings applied to | 6 | 15 |
| Replies (any) | 4 | 12 |
| Calls held | 1 | 5 |
| Agencies holding our acts on file | 1 | 3 |
| Acts in kit (with video + sheet) | 3 solo | 3 solo + troupe + 1 duo or aerial |
| Paid bookings | 0 | 1 (local OK) |
| International offers or holds | 0 | 1 |

## Money (keeping it simple)
Personal bank account is fine to start. **Keep a dedicated account or sub-account only for Circus Bridge money** and log every payment in the Sheet. Formal registration matters once an agency or client needs an invoice from a company. Revisit at the day-60 review.

## Parked (deliberately)
Postiz, Mixpost, SuiteCRM import, the full website, festival submissions (2027 calls are closed; target 2028), direct cruise-line outreach (from Q2 2027 onwards).
