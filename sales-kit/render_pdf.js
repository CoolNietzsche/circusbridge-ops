// Converts every sales-kit/out/*.html to PDF (A4) with the pre-installed Chromium.
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
(async () => {
  const out = path.join(__dirname, 'out'); const b = await chromium.launch(); const p = await b.newPage();
  for (const f of fs.readdirSync(out).filter(f => f.endsWith('.html'))) {
    await p.goto('file://' + path.join(out, f), { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.pdf({ path: path.join(out, f.replace('.html', '.pdf')), format: 'A4', printBackground: true });
    if (process.argv.includes('--png')) await p.screenshot({ path: path.join(out, f.replace('.html', '.png')), fullPage: true });
    console.log('PDF', f.replace('.html', '.pdf'));
  }
  await b.close();
})();
