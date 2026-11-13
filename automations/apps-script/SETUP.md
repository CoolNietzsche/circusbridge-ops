# Circus Bridge HQ: Casting Radar + Artist Intake Form
Runs free inside your Google account (Google Sheets + Apps Script). No server, no VPS, nothing to maintain.

**Setup time: about 10 minutes, once.**

## What you get
| Piece | What it does |
|---|---|
| **Circus Bridge HQ** (Google Sheet) | Tabs: README, Castings, Sources, Keywords, Artists, Agencies, Bookings |
| **Casting Radar** | Every day at **07:00 Addis time** it checks casting sites, scores each listing against your keywords, adds new matches to *Castings* and emails you a digest. No new matches means no email. |
| **Artist Application form** | A bilingual (English/Amharic) Google Form. **Paste its link in every artist DM** instead of asking questions one by one. Each submission goes into *Artists* with a priority (High/Medium/Low). The artist gets a thank-you email and you get a summary. |

---

## Steps
1. Go to **https://sheets.new** while signed in to the Google account you want to use (ideally a Circus Bridge Gmail).
2. Menu **Extensions → Apps Script**. A code editor opens.
3. Delete everything in `Code.gs` and paste the full contents of [`Code.gs`](Code.gs) from this repo (on GitHub: open the file → **Raw** → select all → copy).
4. Click **💾 Save**.
5. In the function dropdown at the top, choose **`setup`** → **▶ Run**.
6. Google asks for permission: **Review permissions** → choose your account → **Advanced** → **Go to Untitled project (unsafe)** → **Allow**.
   *"Unsafe" only means Google hasn't reviewed a script you wrote yourself. It needs Sheets, Forms, sending email (as you) and fetching web pages.*
7. Wait for "Execution completed". Go back to the Sheet: it's now **Circus Bridge HQ**, and the **README** tab has your **form link**.
8. Test the radar: in Apps Script choose **`testSources`** → **▶ Run** → open **Execution log** (bottom).
   👉 **Copy the whole log and paste it to Claude.** It shows which sites returned listings, so we can fix any source that doesn't.
9. Run **`runRadar`** once. Matches appear in *Castings* and the digest email arrives.
10. Test the form yourself: open the form link, submit a test application with your own email, check the *Artists* tab and both emails, then delete the test row.

## Make it better (optional, 5 min): Google Alerts as extra sources
Google Alerts catch castings on sites we don't track.
1. Go to **google.com/alerts**. Create an alert, e.g. `"circus" (casting OR audition) (cruise OR resort OR Dubai)`.
2. **Show options → Deliver to: RSS feed** → Create.
3. Right-click the RSS icon next to the alert → copy the link.
4. Paste it into a *Google Alert* row in the **Sources** tab and tick **Active**.

Suggested alerts:
- `"acrobats" (casting OR "looking for") 2027`
- `"variety acts" (cruise OR resort) casting`
- `"circus artists" (Dubai OR Riyadh OR Doha OR Saudi)`
- `"jugglers" OR "juggler" casting resort`

## Daily use (5 minutes)
1. Open the digest email → click the interesting ones.
2. In *Castings*, set **Status**: `Interesting` / `Applied` / `Skip`.
3. For anything `Interesting`, tell Claude which act fits, and Claude drafts the application.
4. In *Artists*, review `High` first. Set Status: `Reviewing` → `Shortlisted` → `Signed` / `Declined`.

## Tuning
- **Too much noise?** In *Keywords*, lower positive weights or add negatives (e.g. `ballet, -3`). Or raise `MIN_SCORE` at the top of the script.
- **A source shows "Links seen = 0" or an error?** The site changed or blocks robots. Untick Active and send Claude the URL.
- **Change the run time:** edit `RADAR_HOUR` at the top, save, then run `setup` again. It's safe to re-run: it never deletes your data or creates a second form.

## Privacy
Artist data (phones, emails, passport info) lives **only in your Google Sheet**. Never copy it into the public GitHub repo.
