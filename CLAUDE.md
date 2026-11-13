# CIRCUS BRIDGE: Project Context for Claude Code

> Read this file first. It is the source of truth for what Circus Bridge is, what has been built, what state everything is in, and what needs doing next.
> Last compiled: November 2026 (project is restarting after a pause since about May 2026).

---

## 1. What Circus Bridge Is

Circus Bridge is a **talent agency based in Addis Ababa, Ethiopia** that represents Ethiopian circus performers (acrobats, jugglers, balance specialists, aerial artists, contortionists, fire performers) and **books them with international clients**: cruise lines, luxury hotels and resorts, international festivals, event production companies, talent agents/brokers, and TV/film productions.

- **Tagline:** "Ethiopian Circus Talent for the World's Stages"
- **Founded / launched:** March 2026
- **Business model:** Commission on bookings (typical industry range 10-20%). Relationship and representation business with low overhead. We package talent, handle contracts, logistics, travel/visa support, riders and payments.
- **Two audiences:**
  - **Demand side (buyers):** entertainment directors, event producers, festival programmers, agents. Professional, skeptical, time-poor.
  - **Supply side (artists):** Ethiopian circus performers who DM on Instagram asking for work.

### The core thesis
Ethiopia has world-class circus talent with almost no direct access to the global market. Buyers are tired of seeing the same acts from the same countries. Ethiopian circus is distinctive, athletic and culturally authentic. Circus Bridge is the bridge.

### Primary goal
**Secure the first signed international booking contract.** The original 60-day plan (Mar 16 to May 14, 2026) was not completed; the project went quiet and is being restarted. Re-baseline the plan, do not assume old dates still apply.

---

## 2. Brand Rules (apply to everything: copy, images, website, emails)

| Item | Value |
|---|---|
| Navy | `#1B4F9A` |
| Gold | `#C8952A` |
| White | `#FFFFFF` |
| Near-black (backgrounds) | `#07090F` |
| Light section background | `#F4F6F9` |
| Text | `#1A1A2E` |
| Headings font | Playfair Display (or similar elegant serif) |
| Body font | Inter / DM Sans |

**Logo (new, current):** gold semicircular arch with Ethiopian geometric patterns and green/yellow/red flag accents, black aerial-silk artist silhouette inside the arch, bold black "CIRCUS / BRIDGE" wordmark, green-yellow-red stripe, "ETHIOPIAN TALENT AGENCY" tagline. Two formats exist: square (profile pictures, favicon) and horizontal with tagline (website header, email signature, LinkedIn/Facebook banner). The **old logo** (dark background with glitter/bokeh, hand-balancer on a flag-colored arch) is retired. Do not use it.

**Voice:** proud, professional, aspirational, culturally rich. Confident but not arrogant. International but authentically Ethiopian.
- Artists are **world-class**, never "exotic novelties". Never use the word "exotic".
- No folksy, clip-art circus or "African stereotype" styling. Reference: Cirque du Soleil, luxury brand advertising.
- Never open outreach with "I hope this email finds you well". Keep first emails under ~150 words, offer a 20-minute call, include the showreel link.

**Hashtags**
- Always: `#CircusBridge #EthiopianCircus #AfricanTalent`
- Rotate: `#CircusArtist #CircusLife #LiveEntertainment #Acrobatics #EthiopiaPerforms #AfricaPerforms #CircusBooking`
- LinkedIn/B2B (few, not heavy): `#EntertainmentDirector #CruiseEntertainment #EventEntertainment #TalentAgency #EventProfs`

---

## 3. Contact and Identity Details

- **Domain:** `circusbridge.pro.et` (free .pro.et domain, Yegara hosting with DirectAdmin)
- **Email (only one mailbox available):** `circuscr@circusbridge.pro.et`
- **Older/public references:** earlier materials used `info@circusbridge.com` and `circusbridge.com` and `artists@circusbridge.com`. These addresses are **not confirmed as live**. Standardise everything on the `.pro.et` mailbox unless the user confirms otherwise.
- **Phone:** +251 904 216 239
- **Instagram:** @circusbridge, **Facebook:** Circus Bridge, **LinkedIn:** Circus Bridge company page
- **Old landing page (Manus AI, temporary, no CMS):** https://circusbridge-3pyr8mvm.manus.space/ (contains sample performer names that are not real; do not reuse its content blindly)

---

## 4. Roster

| Performer | Act | Notes |
|---|---|---|
| **Yoni** | Juggling and bouncing ball, hat manipulation | Two costume sets: gold sequin suit, and white/black patterned outfit with colorful hats. Photos exist. |
| **Nahom** | Board and ball balance; railing, basketball-on-stand and pedestal apparatus acts | The venue screen in his photo reads "HAILESELASIE NAHOM.T". Earlier content in this project called him "Haileselasie". In Ethiopian naming, Haileselasie is probably his father's name. **Confirm his preferred stage name with the user before publishing anything further.** Two costume looks: white shirt and black vest (formal), and geometric African-pattern vest and leggings. 4 photos (2 B&W railing, 2 color). |
| **Nati** | Ladder balance plus club and ball juggling | Has performed in the UK (outdoor professional shoot). 3 photos (ladder + arms spread, B&W juggling with glass prop, ladder + green clubs). |

**Artist intake pipeline:** Instagram DMs from artists asking for work. A 9-template DM sequence exists (first reply, collect materials, group acts, low-quality video, strong candidate, decline, follow-up, accept). Materials to collect: video reel (YouTube/Vimeo), 3-10 action photos, bio, act description and duration, years of experience, international experience, passport/travel availability, fee expectations, technical rider.

---

## 5. Target Markets and Prospect Database

- **Regions:** UAE / Middle East (incl. Saudi), Europe (UK especially for agents), Asia resort markets, cruise lines globally.
- **Segments:** cruise lines; circus companies/productions; luxury hotels and resorts; festivals; event production companies; talent agents and brokers.
- **Database:** `CircusBridge_ProspectDatabase.xlsx`, 220+ organisations across 8 sheets (CRM Field Guide, Cruise Lines, Circus & Productions, Luxury Hotels & Resorts, Festivals & Events, Event Production Cos., Agents & Brokers, UK Agencies imported from `agencies.docx`, Grow Your Database strategies). Columns: Organisation Name, Contact Person, Job Title, Email, Phone, Website, LinkedIn, Country, City, Region, Organisation Type, Sub-Type, Market Segment, Fleet/Capacity, Booking Season, Entertainment Budget, CRM Stage, Priority, Source, Notes.
- **Important data-quality warning:** the UK agencies sheet came from a user-supplied document (real contacts). The other sheets were compiled from general knowledge: many **emails, phone numbers and named contacts were inferred or generic (e.g. `info@`, `entertainment@`) and are NOT verified.** Verify before any bulk send (Hunter.io, Apollo.io, LinkedIn). Sending to unverified guessed addresses will hurt deliverability and credibility.
- **High-value leads noted:** PEEL (peelcruise.com, cruise entertainment agent), Tim Raffles Entertainments (Southampton), WEP Worldwide Entertainment Production (Lugano, produces for MSC Cruises), NCL Productions, Stiletto Entertainment, Karen Langford at Costa Cruises, Selection Entertainment (Ireland), Riot Art Entertainment and Acrobat Agency (UK circus/variety specialists), Flash Entertainment and Done Events (UAE).

---

## 6. Infrastructure and Tooling (current state)

### 6.1 VPS (shared with other important systems: handle with care)
- **Host:** Ubuntu 22.04, IP `<VPS_IP>`, root SSH. **15 GB RAM, 75 GB disk, about 89% used (roughly 8 GB free). Disk is tight.** No swap.
- **This repo is PUBLIC: never commit the VPS IP, passwords, keys, artist IDs or private contact data.** Use `<VPS_IP>` as a placeholder.
- **Credentials are NOT stored in this file.** Keep them in `.env` files / a password manager. The root password was previously pasted into a chat: **rotate it** and move to SSH keys.
- The server also runs **production-critical Odoo and ERPNext stacks** (many containers: `odoo18*`, `odoo-prod-stable`, `test_odoo*`, `erpnext-*`, `openwebui`, plus nginx, MariaDB, Redis, Ollama, LXD).

### 6.2 HARD SAFETY RULES for any work on the VPS
1. Never stop, remove, restart or reconfigure any non-Circus-Bridge container, volume, network or compose project.
2. Never run `docker system prune`, `docker volume rm`, `docker network rm`, `apt remove/purge` or anything destructive without explicit user approval.
3. Never edit existing nginx site configs (list the existing sites with `ls /etc/nginx/sites-enabled` before touching anything). Only add new files for new Circus Bridge subdomains, then `nginx -t` before `reload`.
4. Audit first (`docker ps`, `ss -tlnp`, `docker network ls`, `df -h`), and confirm a port is free before using it.
5. Keep all Circus Bridge work inside `/opt/circusbridge/<tool>/` with its own compose project and its own network.
6. Watch disk (89%). Check `df -h` before pulling images; do not pull large images blindly.

**Ports already in use (do not take):** 22, 80, 443, 2222, 3001, 3306, 3500, 6379, 8072, 8073, 8075, 8090, 9000, 9071, 9075, 10018, 10081, 11434, 20018.
**Ports used by Circus Bridge:** `4500` Mixpost, `5800` n8n, `4600` Postiz.

### 6.3 Deployed tools

| Tool | Purpose | Location | State |
|---|---|---|---|
| **SuiteCRM** | CRM (performers, clients, outreach) | Installed per user | Pipeline: Research → Contacted → Engaged → Discovery Call → Proposal Sent → Negotiating → Closed Won / Lost. Prospect DB not confirmed imported. |
| **Mixpost (free/Lite)** | Social scheduler | `/opt/circusbridge/mixpost`, `http://<VPS_IP>:4500` | Running and login works, but **the free version only supports Mastodon**. Facebook/Instagram/LinkedIn need the paid Pro license. User refuses to pay. Plan is to replace with Postiz. Laravel `APP_KEY` was regenerated to fix a 500 error. |
| **n8n** | Automation | `/opt/circusbridge/n8n`, `http://<VPS_IP>:5800` (basic auth) | Running. **No real automations built yet.** Planned: weekly content reminder, daily post alert, inbound email → SuiteCRM lead, monthly analytics reminder. |
| **Postiz** | Replacement scheduler (supports IG/FB/LinkedIn free) | `/opt/circusbridge/postiz`, port `4600`, intended URL `https://postiz.messeret.com` | **Installation unfinished.** Backend crashed with `ECONNREFUSED ::1:7233` (needs Temporal). A compose file with `temporal` + `temporal_ui` services was provided but **it is unconfirmed whether it was run.** Nginx server block for `postiz.messeret.com` was written by the user, DNS A record was added (propagating at the time), certbot 1.21.0 is available, SSL not confirmed. Verify the current state before changing anything. |
| **Canva** | Graphics | User has Canva Edu Pro | n/a |
| **Gemini ("Nanobanana")** | AI image generation | external | Prompts are the main deliverable (see §8). |
| **Brevo / Metricool / Notion** | Email marketing / analytics / planning | cloud free tiers | Recommended, setup status unknown. |
| **Calendar** | Google Calendar connector | | Previous attempts to create events were denied or timed out. Don't rely on it. |

### 6.4 Website
- **Goal:** a fresh, CMS-driven website on `circusbridge.pro.et` (replace the Manus landing page).
- **Hosting options considered:** (A) WordPress on Yegara DirectAdmin (Astra + Elementor + WPForms + Yoast), recommended for ease of editing and keeps VPS disk free; (B) self-hosted Next.js + Payload CMS (or Keystatic/TinaCMS) on the VPS. A very detailed Manus AI prompt was written for option B. Decision not finalised; **ask the user which route they chose** before building.
- **Required pages:** Home, Performers (+ per-artist pages), Services, About, Book Now (booking inquiry form), Join Our Roster (artist application form), Contact.
- **Required forms** both email `circuscr@circusbridge.pro.et` and are stored in the CMS (booking statuses New/Contacted/Closed; applications New/Under Review/Accepted/Declined).
- Needs SEO basics (meta, OG, sitemap, schema), mobile-first layout, and real copy (no lorem ipsum, no sample performer names).

---

## 7. Content Strategy (social: Instagram, Facebook, LinkedIn)

**Pillars and rough cadence:** performer spotlights (user currently wants variety, not only spotlights), behind-the-scenes, "Did you know"/educational, act-type showcases, vision/"imagine this" B2B posts, infographics and stats, how-it-works, "why Ethiopian circus", recruitment posts, brand manifesto, logo reveal, testimonials (once real ones exist). LinkedIn: 2 direct B2B text posts/week.

**Deliverable format the user expects for every post (do this by default):**
1. A **long, detailed, production-ready Gemini image prompt** (specify format 1:1 or 4:5, exact text to render, brand colors, layout, style references).
2. **Three separate captions:** Instagram (punchy, emojis, ~12 hashtags), Facebook (warm, detailed, little/no hashtags), LinkedIn (professional, direct, few hashtags, no emoji overload).
3. Always include a clear CTA and contact line.

**Existing image-prompt systems** (reuse the structure): performer photo enhancement (Step 1: clean background, spotlight, upscale) then spotlight card design (Step 2: name treatment, gold CTA strip, CB monogram). Photo-specific card layouts exist for Nahom's four images. Generated post graphics already produced: split-diagonal cruise-deck/acrobat card and navy/gold handstand brand card.

**Claims to verify before publishing more** (some earlier copy overstated or assumed):
- Statistics used in infographics ("$32B live entertainment", "30M+ cruise passengers", "180+ countries") are rough and **unsourced**; verify or soften.
- "Performed across Europe, the Middle East and Asia", "3 continents", "first dedicated agency": confirm what is actually true for the current roster before claiming.
- "Industry testimonials": none exist yet. Do not fabricate any.

---

## 8. Files That Already Exist (ask the user to re-supply if needed)

- `Circus_Bridge_60Day_Plan.docx`: original 60-day execution plan, templates, KPIs, SuiteCRM field recommendations.
- `CircusBridge_ProspectDatabase.xlsx`: prospect database (see §5).
- `agencies.docx`: original UK agency list supplied by the user.
- Logo files (square and horizontal), performer photos (Yoni x2, Nati x3, Nahom x4).
- Manus AI prompt for the new website; 9 Instagram DM templates for artist recruitment; a short venture brief for a prospective collaborator.

---

## 9. TASK BACKLOG

Priority legend: **P0** = unblocks revenue or is broken now, **P1** = next, **P2** = later. Items marked 🤖 are good for Claude Code to do directly; items marked 👤 need the user.

### P0: Get the sales engine actually running
- [ ] 🤖👤 **Re-baseline the plan.** Original dates (Mar 16 to May 14) are over. Create a fresh 60-day plan starting from the restart date with weekly KPIs.
- [ ] 🤖👤 **Finish Postiz** (see 6.3): inspect `docker compose ps` / logs in `/opt/circusbridge/postiz`, confirm Temporal is up, confirm backend on 3000 and frontend on 5000, finish nginx + certbot for `postiz.messeret.com`, verify HTTPS. Then connect Instagram, Facebook, LinkedIn (needs Meta and LinkedIn developer apps, HTTPS callback URLs). Obey the VPS safety rules.
- [ ] 👤 **Rotate VPS root password / switch to SSH keys; change default Mixpost and n8n passwords.**
- [ ] 🤖👤 **Decommission or leave Mixpost** once Postiz works (do not delete volumes without asking; disk is tight, so propose cleanup of unused Circus Bridge images).
- [ ] 🤖 **Verify and clean the prospect database:** dedupe, validate email syntax and MX, flag guessed `info@` addresses, mark verified vs unverified, and prioritise the top 50 (cruise entertainment agents, UAE event producers, UK circus/variety agents).
- [ ] 🤖 **Import to SuiteCRM:** convert each sheet to CSV matching SuiteCRM Accounts/Contacts fields, write an import mapping, and load. Set pipeline stage = Research.
- [ ] 👤 **Showreel v1:** a 90-second master reel plus per-act clips (this is the #1 sales asset; nothing converts well without it). Host on YouTube (unlisted) and Vimeo.
- [ ] 🤖 **Outreach sequence:** write final cold-email + Day 4 / Day 7 / Day 14 follow-ups using `circuscr@circusbridge.pro.et`; set up sending via Brevo (300/day free) or SMTP, warm up the mailbox first (single new mailbox: start with low volume).

### P1: Foundation assets
- [ ] 🤖👤 **Website** (decide WordPress-on-Yegara vs self-hosted CMS), build, deploy to `circusbridge.pro.et`, SSL, working forms, correct logo and real performer content.
- [ ] 🤖 **Confirm email/domain setup:** SPF, DKIM, DMARC for `circusbridge.pro.et` so outreach lands in inboxes.
- [ ] 🤖 **n8n automations:** (1) inbound email/form → SuiteCRM lead + auto-reply; (2) weekly content reminder; (3) follow-up reminders when a lead sits in "Contacted" 4 and 7 days; (4) monthly analytics reminder. Export workflows as JSON into the repo.
- [ ] 👤 **Performer documentation:** confirm each artist's stage name, collect bio, years of experience, past venues, passport status, fee range, technical rider; add as SuiteCRM Performer records. Build a one-page act sheet (PDF) per performer.
- [ ] 🤖 **Portfolio/capability deck** (1 to 2 pages PDF, brand colors) for attaching or linking in outreach.
- [ ] 👤 **Metricool / Brevo / Notion setup**; Google Business and LinkedIn company page completed with new logo.
- [ ] 🤖 **Content pipeline repo:** keep post prompts and captions as markdown/YAML (one file per post: type, platforms, image prompt, 3 captions, status, date), plus a script to generate a weekly batch skeleton.

### P2: Growth
- [ ] 👤 Register on talent directories (ShowsBee, Booking Agent Info, FEDEC, GigSalad/The Bash) and submit to festivals (Edinburgh Fringe, Cirque de Demain, BIAF, Riyadh Season, DEAL Dubai).
- [ ] 👤 Pitch trade press (Cruise Industry News, Seatrade, Event Magazine, The Stage, Africa Is a Country).
- [ ] 🤖 Pursue co-representation deals with UK/UAE circus-variety agents.
- [ ] 👤 Build artist pipeline from Instagram DMs using the 9 templates; track in SuiteCRM.
- [ ] 🤖 Package multi-performer **show products** (solo / duo / full show) with indicative pricing structure.
- [ ] 🤖 Contract and booking templates (deposit 30-50%, cancellation, travel/visa, rider, commission split). Have a lawyer review before use.

---

## 10. How to Work With the User

- Bias to **action and speed over perfection**; give copy-paste-ready output.
- Do not make the user re-explain what Circus Bridge is.
- Refer to performers by **name and act**; write specifically, not generically.
- The user is technical (runs their own VPS, uses Docker/SSH), but wants numbered, exact commands and the pasted output verified step by step before moving on.
- When something fails, ask for the exact log output, diagnose, and give one fix at a time.
- Before any irreversible or server-wide action, state what it touches and wait for confirmation.

---

## 11. Decisions & updates (Nov 13, 2026): these OVERRIDE older sections

- **Strategy reset:** agency-first (wholesale supply to international casting agencies) + Gulf events + local Addis premium market. See `research/01_market_research_nov2026.md` and `plan/60_day_plan.md` (16 Nov 2026 → 14 Jan 2027).
- **Postiz, Mixpost, SuiteCRM import, full website: PARKED.** Use Meta Business Suite (IG/FB) + LinkedIn native scheduling. CRM = one Google Sheet driven by n8n.
- **User is a solo operator with only a few hours a week**, so automate everything possible (n8n: casting radar, outreach sequencer, inbound catcher, artist intake form).
- Company **not registered**; the user's personal bank account will be used for now. Don't push this; just recommend keeping Circus Bridge money separate.
- All three artists **have passports**. User has a **contact at Circus Ethiopia** (pursue a troupe partnership). Several IG artists have footage they are willing to share.
- User has created the social pages and posted some posts (example: https://www.instagram.com/p/DW7Mz-qiONo/). Claude can't read Instagram from this container; ask for screenshots or captions.

## 12. Session environment notes (added Nov 13, 2026)

- Claude Code is running in an ephemeral cloud container, not on the VPS and not on the user's machine. The working directory `/home/user` is **not a git repo**: anything worth keeping must be pushed to a GitHub repo or downloaded by the user.
- Claude cannot SSH into the VPS from here. All VPS work = Claude gives exact numbered commands, the user runs them and pastes output back.
- None of the files in §8 are present in this container yet; the user must upload them.
