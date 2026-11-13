/**
 * CIRCUS BRIDGE HQ: Casting Radar + Artist Intake Form (Google Apps Script)
 * ----------------------------------------------------------------------------
 * Setup (once): create a blank Google Sheet → Extensions → Apps Script →
 * replace everything in Code.gs with this file → Save → select `setup` →
 * Run → approve permissions. Full guide: automations/apps-script/SETUP.md
 *
 * What it does
 *  - setup()          builds the tabs, creates the bilingual Artist Application
 *                     form, and installs the daily radar + form triggers.
 *  - runRadar()       (daily, 07:00 Addis time) reads every active row in
 *                     "Sources", scores new casting links against "Keywords",
 *                     appends matches to "Castings" and emails you a digest.
 *  - onArtistSubmit() (on every form submission) copies the application into
 *                     "Artists", sets a priority, emails the artist a
 *                     thank-you and emails you a summary.
 *  - testSources()    debug helper: fetches each source and logs what it saw.
 */

const CB = {
  TZ: 'Africa/Addis_Ababa',
  REPLY_TO: 'circuscr@circusbridge.pro.et',
  SENDER_NAME: 'Circus Bridge',
  RADAR_HOUR: 7,          // 07:00 Addis Ababa
  MIN_SCORE: 4,           // links scoring below this are ignored
  MAX_NEW_PER_RUN: 40,
  UA: 'Mozilla/5.0 (compatible; CircusBridgeRadar/1.0)',
};

// ---------------------------------------------------------------- tabs ----
const TABS = {
  Castings: ['Found', 'Score', 'Title', 'Source', 'Link', 'Matched keywords', 'Status', 'Notes'],
  Sources: ['Active', 'Name', 'Type (rss/html)', 'URL', 'Link pattern (regex, optional)', 'Last checked', 'Links seen', 'New matches', 'Last error'],
  Keywords: ['Keyword', 'Weight'],
  Artists: ['Received', 'Priority', 'Status', 'Stage name', 'Full name', 'Act type', 'Performers', 'Disciplines', 'Video link(s)', 'Photo link(s)', 'Passport', 'Passport expiry year', 'Availability', 'English', 'Countries performed', 'Email', 'Phone / WhatsApp', 'Instagram', 'City', 'Act description', 'Act duration(s)', 'Years performing', 'Visa refusals', 'Fee expectation', 'Equipment / technical needs', 'Notes'],
  Agencies: ['Organisation', 'Contact person', 'Role', 'Email', 'Country', 'Segment', 'Status', 'Last contact', 'Next step', 'Notes'],
  Bookings: ['Date', 'Client', 'Artist(s)', 'Format', 'Location', 'Fee (USD)', 'Deposit received', 'Status', 'Notes'],
};

const STATUS = {
  Castings: ['New', 'Interesting', 'Applied', 'Skip'],
  Artists: ['New', 'Reviewing', 'Shortlisted', 'Signed', 'Declined'],
  Agencies: ['Research', 'Ready', 'Contacted', 'Replied', 'Call booked', 'Has our acts', 'Not now'],
  Bookings: ['Inquiry', 'Quoted', 'Hold', 'Confirmed', 'Deposit paid', 'Completed', 'Lost'],
};

// Starting list. Edit the Sources tab freely: add rows, untick Active, change patterns.
const DEFAULT_SOURCES = [
  [true, 'CircusTalk jobs', 'html', 'https://circustalk.com/circus-jobs/', '/circus-jobs/[a-z0-9-]+'],
  [true, 'CircusTalk news', 'rss', 'https://circustalk.com/feed', ''],
  [true, 'StageLync jobs & auditions', 'html', 'https://stagelync.com/pro/jobs-and-auditions', '/jobs-and-auditions/p-'],
  [true, 'Entertainers Worldwide: speciality/variety', 'html', 'https://www.entertainersworldwidejobs.com/speciality-variety-act-jobs', '-\\d{4,}(\\.html)?$'],
  [true, 'Entertainers Worldwide: cruise', 'html', 'https://www.entertainersworldwidejobs.com/cruise-ship-entertainment-jobs-and-auditions', '-\\d{4,}(\\.html)?$'],
  [true, 'Rising Stars contracts', 'html', 'https://www.risingstars.com.ua/jobs.php', ''],
  [true, 'On the Move (calls & festivals)', 'html', 'https://on-the-move.org/news', '/news/[a-z0-9-]+'],
  [false, 'Google Alert #1 (paste RSS URL, then tick Active)', 'rss', '', ''],
  [false, 'Google Alert #2 (paste RSS URL, then tick Active)', 'rss', '', ''],
];

const DEFAULT_KEYWORDS = [
  // what we sell: strong positive
  ['circus', 3], ['acrobat', 3], ['juggl', 3], ['equilibr', 3], ['balance act', 3], ['rola bola', 3], ['rolla bolla', 3],
  ['ladder', 3], ['handstand', 3], ['hand to hand', 3], ['hand-to-hand', 3], ['adagio', 3], ['african', 3], ['troupe', 3],
  ['variety', 3], ['speciality act', 3], ['specialty act', 3], ['contortion', 3], ['chinese pole', 2], ['cyr wheel', 2],
  ['teeterboard', 2], ['icarian', 2], ['tumbling', 3], ['ground act', 3],
  // where & how: positive
  ['cruise', 2], ['resort', 2], ['hotel', 2], ['casting', 2], ['audition', 1], ['contract', 1], ['dubai', 2], ['abu dhabi', 2],
  ['uae', 2], ['saudi', 2], ['riyadh', 2], ['jeddah', 2], ['qatar', 2], ['doha', 2], ['oman', 2], ['bahrain', 2], ['turkey', 2],
  ['antalya', 2], ['egypt', 2], ['hurghada', 2], ['china', 2], ['theme park', 2], ['india', 1], ['wedding', 1], ['gala', 1],
  ['festival', 1], ['roaming', 2], ['walkabout', 2], ['duo', 1], ['group', 1], ['street', 1], ['2027', 1], ['season', 1],
  // not for us: negative
  ['singer', -3], ['vocalist', -3], ['pianist', -3], ['musician', -2], ['band', -2], ['dj', -3], ['model', -2], ['actor', -2],
  ['expired', -6], ['closed', -4],
];

// ---------------------------------------------------- form questions ----
const Q = {
  fullName: 'Full name / ሙሉ ስም',
  stageName: 'Stage name (if different) / የመድረክ ስም',
  email: 'Email',
  phone: 'Phone / WhatsApp',
  instagram: 'Instagram handle',
  city: 'City / ከተማ',
  actType: 'Act type / የትርዒት ዓይነት',
  performers: 'How many performers are in the act? / ስንት ተዋናዮች?',
  disciplines: 'Disciplines / ሙያ',
  description: 'Describe your act (what the audience sees, highlights, tricks) / ትርዒትዎን ይግለጹ',
  duration: 'Act duration(s) you can perform (e.g. 7 min act, 20 min show) / የትርዒት ርዝመት',
  years: 'Years performing / ስንት ዓመት',
  video: 'Video link(s): YouTube, Google Drive or Instagram. A full, unedited act is best. / የቪዲዮ ሊንክ',
  photos: 'Photo link(s): Google Drive folder or Instagram / የፎቶ ሊንክ',
  countries: 'Countries you have performed in outside Ethiopia / ከኢትዮጵያ ውጭ የሰሩባቸው አገሮች',
  passport: 'Do you have a valid passport? / ፓስፖርት አለዎት?',
  passportExpiry: 'Passport expiry year (e.g. 2030) / ፓስፖርት የሚያበቃበት ዓመት',
  visaRefusals: 'Have you ever been refused a visa? / ቪዛ ተከልክለው ያውቃሉ?',
  availability: 'What work can you accept? / ምን ዓይነት ስራ መቀበል ይችላሉ?',
  english: 'English level / የእንግሊዝኛ ደረጃ',
  fee: 'Fee expectation (optional) / የክፍያ ፍላጎት',
  equipment: 'Your own equipment / technical needs (rigging, ceiling height, floor) / መሳሪያ እና ቴክኒካል ፍላጎቶች',
  consent: 'Consent / ስምምነት',
};

const CONSENT_TEXT = 'I agree that Circus Bridge may use the videos and photos I share to promote me to bookers and on Circus Bridge channels. I understand Circus Bridge never charges artists any fees. / Circus Bridge የላክሁትን ቪዲዮ እና ፎቶ እኔን ለማስተዋወቅ እንዲጠቀም እስማማለሁ። Circus Bridge ከአርቲስቶች ምንም ክፍያ እንደማይጠይቅ ተረድቻለሁ።';

// ================================================================ SETUP ===
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  PropertiesService.getScriptProperties().setProperty('SHEET_ID', ss.getId());
  ss.setSpreadsheetTimeZone(CB.TZ);
  if (/^Untitled/i.test(ss.getName())) ss.rename('Circus Bridge HQ');

  Object.keys(TABS).forEach(name => ensureTab_(ss, name, TABS[name]));
  seed_(ss.getSheetByName('Sources'), DEFAULT_SOURCES);
  seed_(ss.getSheetByName('Keywords'), DEFAULT_KEYWORDS);
  ss.getSheetByName('Sources').getRange('A2:A').insertCheckboxes();
  Object.keys(STATUS).forEach(name => {
    const sh = ss.getSheetByName(name);
    const col = TABS[name].indexOf('Status') + 1;
    sh.getRange(2, col, sh.getMaxRows() - 1, 1).setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(STATUS[name], true).setAllowInvalid(false).build());
  });
  const def = ss.getSheetByName('Sheet1');
  if (def && ss.getSheets().length > 1 && def.getLastRow() === 0) ss.deleteSheet(def);

  const form = ensureForm_(ss);
  installTriggers_(form);
  writeReadme_(ss, form);

  const msg = 'Circus Bridge HQ is ready.\n\nArtist form (share this link):\n' + form.getPublishedUrl() +
    '\n\nCasting radar runs daily at ' + CB.RADAR_HOUR + ':00 Addis time. Run runRadar now to test it.';
  Logger.log(msg);
  try { SpreadsheetApp.getUi().alert(msg); } catch (e) { /* run from editor: no UI */ }
}

function ensureTab_(ss, name, headers) {
  let sh = ss.getSheetByName(name) || ss.insertSheet(name);
  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, headers.length).setValues([headers])
      .setFontWeight('bold').setBackground('#1B4F9A').setFontColor('#FFFFFF');
    sh.setFrozenRows(1);
  }
  return sh;
}

function seed_(sh, rows) {
  if (sh.getLastRow() > 1) return;            // never overwrite your edits
  sh.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
}

function ensureForm_(ss) {
  const props = PropertiesService.getScriptProperties();
  const existing = props.getProperty('FORM_ID');
  if (existing) { try { return FormApp.openById(existing); } catch (e) { /* deleted: recreate */ } }

  const f = FormApp.create('Circus Bridge: Artist Application');
  f.setDescription(
    'Circus Bridge connects Ethiopian circus artists with international bookers: Gulf events, resorts, cruise productions and festivals. ' +
    'Tell us about your act. It takes about 5 minutes. We never charge artists any fees.\n\n' +
    'Circus Bridge የኢትዮጵያ ሰርከስ አርቲስቶችን ከዓለም አቀፍ ቡከሮች ጋር ያገናኛል። ስለ ትርዒትዎ ይንገሩን፣ 5 ደቂቃ ያህል ይወስዳል። ከአርቲስቶች ምንም ክፍያ አንጠይቅም።')
    .setConfirmationMessage('Thank you! We review every application and will contact you if your act matches a current request. / እናመሰግናለን! ማመልከቻዎን እንመለከታለን።')
    .setAllowResponseEdits(false).setLimitOneResponsePerUser(false);
  if (typeof f.setRequireLogin === 'function') { try { f.setRequireLogin(false); } catch (e) { /* consumer accounts */ } }

  f.addSectionHeaderItem().setTitle('1. About you / ስለ እርስዎ');
  f.addTextItem().setTitle(Q.fullName).setRequired(true);
  f.addTextItem().setTitle(Q.stageName);
  f.addTextItem().setTitle(Q.email).setRequired(true)
    .setValidation(FormApp.createTextValidation().requireTextIsEmail().build());
  f.addTextItem().setTitle(Q.phone).setRequired(true);
  f.addTextItem().setTitle(Q.instagram);
  f.addTextItem().setTitle(Q.city).setRequired(true);

  f.addSectionHeaderItem().setTitle('2. Your act / ትርዒትዎ');
  f.addMultipleChoiceItem().setTitle(Q.actType).setRequired(true)
    .setChoiceValues(['Solo / ብቻ', 'Duo / ሁለት', 'Group 3+ / ቡድን']);
  f.addTextItem().setTitle(Q.performers);
  f.addCheckboxItem().setTitle(Q.disciplines).setRequired(true).setChoiceValues([
    'Acrobatics / tumbling / pyramids', 'Hand-to-hand / adagio', 'Aerial (silks, hoop, trapeze, straps)', 'Juggling',
    'Balance / equilibrium (rola bola, handstands, ladder)', 'Contortion', 'Fire', 'Hula hoop', 'Clown / comedy',
    'Stilts', 'Dance', 'Other']);
  f.addParagraphTextItem().setTitle(Q.description).setRequired(true);
  f.addTextItem().setTitle(Q.duration);
  f.addTextItem().setTitle(Q.years);
  f.addParagraphTextItem().setTitle(Q.video).setRequired(true).setValidation(
    FormApp.createParagraphTextValidation().requireTextContainsPattern('http').setHelpText('Please paste a link starting with http').build());
  f.addParagraphTextItem().setTitle(Q.photos);
  f.addParagraphTextItem().setTitle(Q.equipment);

  f.addSectionHeaderItem().setTitle('3. Travel & availability / ጉዞ');
  f.addTextItem().setTitle(Q.countries);
  f.addMultipleChoiceItem().setTitle(Q.passport).setRequired(true)
    .setChoiceValues(['Yes / አዎ', 'No / የለኝም', 'Applying / በሂደት ላይ']);
  f.addTextItem().setTitle(Q.passportExpiry);
  f.addMultipleChoiceItem().setTitle(Q.visaRefusals)
    .setChoiceValues(['No / አይ', 'Yes / አዎ', 'Prefer to discuss / በግል ማውራት እመርጣለሁ']);
  f.addCheckboxItem().setTitle(Q.availability).setRequired(true).setChoiceValues([
    'Single events (a few days) / አጭር ዝግጅቶች', '1–3 month contracts / 1–3 ወር', '6+ month contracts (cruise, resort season) / 6+ ወር']);
  f.addMultipleChoiceItem().setTitle(Q.english).setRequired(true)
    .setChoiceValues(['None / የለም', 'Basic / መሰረታዊ', 'Good / ጥሩ', 'Fluent / በጣም ጥሩ']);
  f.addTextItem().setTitle(Q.fee);
  f.addCheckboxItem().setTitle(Q.consent).setRequired(true).setChoiceValues([CONSENT_TEXT]);

  f.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  props.setProperty('FORM_ID', f.getId());
  return f;
}

function installTriggers_(form) {
  ScriptApp.getProjectTriggers()
    .filter(t => ['runRadar', 'onArtistSubmit'].indexOf(t.getHandlerFunction()) >= 0)
    .forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('runRadar').timeBased().atHour(CB.RADAR_HOUR).everyDays(1).inTimezone(CB.TZ).create();
  ScriptApp.newTrigger('onArtistSubmit').forForm(form).onFormSubmit().create();
}

function writeReadme_(ss, form) {
  const sh = ss.getSheetByName('README') || ss.insertSheet('README', 0);
  sh.clear();
  const rows = [
    ['Circus Bridge HQ'],
    [''],
    ['Artist application form (paste in DMs / bio):', form.getPublishedUrl()],
    ['Form editor (to change questions):', form.getEditUrl()],
    [''],
    ['Castings', 'Filled automatically every morning. Set Status: Interesting / Applied / Skip.'],
    ['Sources', 'Sites the radar checks. Add rows; untick Active to pause. "Links seen" = 0 or an error means the source needs fixing.'],
    ['Keywords', 'Scoring words. Positive = more relevant, negative = less. Links scoring under ' + CB.MIN_SCORE + ' are ignored.'],
    ['Artists', 'Filled automatically from the form. Priority is a first guess. Set Status as you review.'],
    ['Agencies / Bookings', 'Your pipeline. Fill in by hand for now.'],
  ];
  rows.forEach((r, i) => sh.getRange(i + 1, 1, 1, r.length).setValues([r]));
  sh.getRange('A1').setFontSize(16).setFontWeight('bold').setFontColor('#1B4F9A');
  sh.setColumnWidth(1, 260); sh.setColumnWidth(2, 640);
}

// ========================================================== CASTING RADAR ===
function runRadar() { return radar_(false); }
function testSources() { return radar_(true); }

function radar_(dryRun) {
  const ss = SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.openById(getSheetId_());
  const srcSh = ss.getSheetByName('Sources');
  const castSh = ss.getSheetByName('Castings');
  const keywords = readKeywords_(ss.getSheetByName('Keywords'));
  const linkCol = TABS.Castings.indexOf('Link') + 1;
  const seen = new Set(castSh.getLastRow() > 1
    ? castSh.getRange(2, linkCol, castSh.getLastRow() - 1, 1).getValues().map(r => normUrl_(r[0])) : []);

  const now = new Date();
  const rows = srcSh.getLastRow() > 1 ? srcSh.getRange(2, 1, srcSh.getLastRow() - 1, 5).getValues() : [];
  const fresh = [];
  const health = [];

  rows.forEach((r, i) => {
    const [active, name, type, url, pattern] = r;
    if (!active || !url) return;
    let items = [], err = '', newCount = 0;
    try {
      items = String(type).toLowerCase().trim() === 'rss' ? fetchRss_(url) : fetchHtmlLinks_(url, pattern);
      items.forEach(it => {
        const key = normUrl_(it.link);
        if (seen.has(key)) return;
        const s = score_(it.title + ' ' + slugWords_(it.link) + ' ' + (it.text || ''), keywords);
        if (s.score < CB.MIN_SCORE) return;
        seen.add(key); newCount++;
        fresh.push({ found: now, score: s.score, title: it.title, source: name, link: it.link, kws: s.hits.join(', ') });
      });
    } catch (e) { err = String(e.message || e).slice(0, 200); }
    health.push({ name, links: items.length, newCount, err });
    if (dryRun) Logger.log('%s | links: %s | new matches: %s | %s\n  sample: %s', name, items.length, newCount, err || 'ok',
      items.slice(0, 5).map(x => x.title).join(' || '));
    srcSh.getRange(i + 2, 6, 1, 4).setValues([[now, items.length, newCount, err]]);
  });

  fresh.sort((a, b) => b.score - a.score);
  const toAdd = fresh.slice(0, CB.MAX_NEW_PER_RUN);
  if (!dryRun && toAdd.length) {
    castSh.getRange(castSh.getLastRow() + 1, 1, toAdd.length, 8).setValues(
      toAdd.map(x => [x.found, x.score, x.title, x.source, x.link, x.kws, 'New', '']));
  }
  if (!dryRun && (toAdd.length || health.some(h => h.err))) sendDigest_(ss, toAdd, health);
  Logger.log('Radar done: %s new matches%s', toAdd.length, dryRun ? ' (test only: nothing saved, no email)' : '');
  return toAdd.length;
}

function fetch_(url) {
  const res = UrlFetchApp.fetch(url, { muteHttpExceptions: true, followRedirects: true, headers: { 'User-Agent': CB.UA } });
  const code = res.getResponseCode();
  if (code >= 400) throw new Error('HTTP ' + code);
  return res.getContentText();
}

function fetchRss_(url) {
  const doc = XmlService.parse(fetch_(url));
  const root = doc.getRootElement();
  const out = [];
  const atom = XmlService.getNamespace('http://www.w3.org/2005/Atom');
  if (root.getName() === 'feed') {                                       // Atom (Google Alerts)
    root.getChildren('entry', atom).forEach(e => {
      const linkEl = e.getChild('link', atom);
      let link = linkEl ? linkEl.getAttribute('href').getValue() : '';
      const m = link.match(/[?&]url=([^&]+)/);                             // unwrap google.com/url?url=
      if (m) link = decodeURIComponent(m[1]);
      out.push({ title: strip_(e.getChildText('title', atom)), link, text: strip_(e.getChildText('content', atom) || '') });
    });
  } else {                                                                // RSS 2.0
    const ch = root.getChild('channel');
    (ch ? ch.getChildren('item') : []).forEach(it => out.push({
      title: strip_(it.getChildText('title')), link: (it.getChildText('link') || '').trim(),
      text: strip_(it.getChildText('description') || '').slice(0, 500) }));
  }
  return out.filter(x => x.link);
}

function fetchHtmlLinks_(url, pattern) {
  const html = fetch_(url);
  const base = url.match(/^https?:\/\/[^/]+/)[0];
  const host = base.replace(/^https?:\/\//, '');
  const re = pattern ? new RegExp(pattern, 'i') : null;
  const out = [], seen = {};
  const a = /<a\b[^>]*?href\s*=\s*["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = a.exec(html)) !== null) {
    let link = m[1].trim();
    if (/^(mailto|tel|javascript):/i.test(link)) continue;
    if (link.indexOf('//') === 0) link = 'https:' + link;
    else if (link.charAt(0) === '/') link = base + link;
    else if (!/^https?:/i.test(link)) link = url.replace(/\/[^/]*$/, '/') + link;
    const title = strip_(m[2]);
    if (re ? !re.test(link) : (link.indexOf(host) < 0 || title.length < 15)) continue;
    if (seen[link]) { if (title.length > seen[link].title.length) seen[link].title = title; continue; }
    seen[link] = { title: title || slugWords_(link), link };
    out.push(seen[link]);
  }
  return out;
}

function readKeywords_(sh) {
  if (sh.getLastRow() < 2) return [];
  return sh.getRange(2, 1, sh.getLastRow() - 1, 2).getValues()
    .filter(r => r[0] !== '' && !isNaN(Number(r[1])))
    .map(r => [String(r[0]).toLowerCase().trim(), Number(r[1])]);
}

function score_(text, keywords) {
  const t = ' ' + String(text).toLowerCase().replace(/[^a-z0-9ሀ-፿]+/g, ' ') + ' ';
  let score = 0; const hits = []; const used = {};
  keywords.forEach(([k, w]) => {
    const kk = k.replace(/[^a-z0-9ሀ-፿]+/g, ' ').trim();
    if (!kk || used[kk] || t.indexOf(' ' + kk) < 0) return;   // count "hand to hand" / "hand-to-hand" once
    used[kk] = true; score += w; hits.push(k + (w > 0 ? '+' + w : w));
  });
  return { score, hits };
}

function sendDigest_(ss, items, health) {
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const rows = items.map(x => '<tr><td style="padding:6px;font-weight:bold;color:#1B4F9A">' + x.score + '</td>' +
    '<td style="padding:6px"><a href="' + esc(x.link) + '">' + esc(x.title) + '</a><br><span style="color:#888;font-size:12px">' +
    esc(x.source) + ' · ' + esc(x.kws) + '</span></td></tr>').join('');
  const problems = health.filter(h => h.err || h.links === 0)
    .map(h => '<li>' + esc(h.name) + ': ' + esc(h.err || 'no links found (layout may have changed)') + '</li>').join('');
  const body = '<div style="font-family:Arial,sans-serif;max-width:680px">' +
    '<h2 style="color:#1B4F9A;margin:0 0 4px">Casting Radar</h2>' +
    '<p style="margin:0 0 12px;color:#555">' + items.length + ' new match(es). Open the sheet to mark them Interesting / Applied / Skip: ' +
    '<a href="' + ss.getUrl() + '">Circus Bridge HQ</a></p>' +
    (rows ? '<table style="border-collapse:collapse;width:100%">' + rows + '</table>' : '') +
    (problems ? '<p style="color:#C8952A;margin-top:16px"><b>Sources to check:</b></p><ul>' + problems + '</ul>' : '') + '</div>';
  MailApp.sendEmail({
    to: Session.getEffectiveUser().getEmail(), name: CB.SENDER_NAME,
    subject: 'Casting Radar: ' + items.length + ' new match' + (items.length === 1 ? '' : 'es') + ' (' +
      Utilities.formatDate(new Date(), CB.TZ, 'd MMM') + ')',
    htmlBody: body,
  });
}

// ========================================================== ARTIST INTAKE ===
function onArtistSubmit(e) {
  const a = {};
  e.response.getItemResponses().forEach(ir => {
    const v = ir.getResponse();
    a[ir.getItem().getTitle()] = Array.isArray(v) ? v.join('; ') : String(v);
  });
  const g = k => a[Q[k]] || '';
  const priority = priority_(g('actType'), g('disciplines'), g('video'), g('passport'));
  const ss = SpreadsheetApp.openById(getSheetId_());
  const sh = ss.getSheetByName('Artists');
  sh.appendRow([new Date(), priority, 'New', g('stageName') || g('fullName'), g('fullName'), g('actType'), g('performers'),
    g('disciplines'), g('video'), g('photos'), g('passport'), g('passportExpiry'), g('availability'), g('english'),
    g('countries'), g('email'), g('phone'), g('instagram'), g('city'), g('description'), g('duration'), g('years'),
    g('visaRefusals'), g('fee'), g('equipment'), '']);

  const name = g('stageName') || g('fullName');
  if (g('email')) {
    MailApp.sendEmail({
      to: g('email'), replyTo: CB.REPLY_TO, name: CB.SENDER_NAME,
      subject: 'We received your application / ማመልከቻዎ ደርሶናል: Circus Bridge',
      body: 'Hi ' + name + ',\n\n' +
        'Thank you for applying to Circus Bridge. We watch every video personally.\n\n' +
        'What happens next:\n' +
        '• We review applications every week.\n' +
        '• If your act matches a request from a booker, we will contact you on WhatsApp or email.\n' +
        '• Keep sending us new videos as your act develops. The best full-act video always wins.\n\n' +
        'Circus Bridge never charges artists any fees. We only earn a commission when we book you.\n\n' +
        '---\n' +
        'ሰላም ' + name + '፣\n\nለ Circus Bridge ስላመለከቱ እናመሰግናለን። እያንዳንዱን ቪዲዮ እናያለን። ትርዒትዎ ከቡከር ጥያቄ ጋር ከተስማማ በዋትስአፕ ወይም በኢሜል እናገኝዎታለን። ' +
        'Circus Bridge ከአርቲስቶች ምንም ክፍያ አይጠይቅም።\n\n' +
        'Circus Bridge · Ethiopian Circus Talent for the World\'s Stages\n' + CB.REPLY_TO + ' · +251 904 216 239 · @circusbridge',
    });
  }
  MailApp.sendEmail({
    to: Session.getEffectiveUser().getEmail(), name: 'Circus Bridge HQ',
    subject: 'New artist application: ' + name + ' (' + priority + ')',
    body: name + ' · ' + g('actType') + ' · ' + g('disciplines') + '\nCity: ' + g('city') + ' · Passport: ' + g('passport') +
      ' · English: ' + g('english') + '\nAvailability: ' + g('availability') + '\n\nVideo: ' + g('video') +
      '\n\nAct: ' + g('description') + '\n\nWhatsApp: ' + g('phone') + '\nSheet: ' + ss.getUrl(),
  });
}

function priority_(actType, disciplines, video, passport) {
  const inDemand = /Duo|Group|Acrobatics|Hand-to-hand|Aerial|Contortion/i.test(actType + ' ' + disciplines);
  const ready = /http/i.test(video) && /^Yes/i.test(passport);
  return inDemand && ready ? 'High' : ready ? 'Medium' : 'Low';
}

// ================================================================ helpers ===
function getSheetId_() {
  const p = PropertiesService.getScriptProperties();
  let id = p.getProperty('SHEET_ID');
  if (!id) { id = SpreadsheetApp.getActiveSpreadsheet().getId(); p.setProperty('SHEET_ID', id); }
  return id;
}
function strip_(s) {
  return String(s || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#0?39;|&apos;/g, "'")
    .replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
}
function slugWords_(url) {   // last path segment only, so category folders don't inflate every score
  const path = String(url).replace(/^https?:\/\/[^/]+/, '').split(/[?#]/)[0].replace(/\/+$/, '');
  return path.slice(path.lastIndexOf('/') + 1).replace(/\.(html?|php)$/, '').replace(/[-_.]+/g, ' ');
}
function normUrl_(u) {       // drop tracking params + trailing slash so the same casting isn't added twice
  const parts = String(u).trim().split('#')[0].split('?');
  const q = (parts[1] || '').split('&').filter(p => p && !/^(utm_[^=]*|fbclid|gclid)=/i.test(p)).join('&');
  return (parts[0].replace(/\/+$/, '') + (q ? '?' + q : '')).toLowerCase();
}
