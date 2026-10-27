/**
 * Injects Web3Forms access key from environment into HTML forms at build time.
 * Used by Vercel (Environment Variables) and local `npm run build`.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PLACEHOLDER = '__WEB3FORMS_ACCESS_KEY__';
const KEY = process.env.WEB3FORMS_ACCESS_KEY || '';

const FILES = ['book.html', 'contact.html', 'academy.html'];

if (!KEY) {
  console.warn(
    '[inject-env] WEB3FORMS_ACCESS_KEY is not set.\n' +
      '  Local: create a .env file or export the variable.\n' +
      '  Vercel: Project Settings → Environment Variables → WEB3FORMS_ACCESS_KEY'
  );
}

let replaced = 0;
for (const file of FILES) {
  const filePath = path.join(ROOT, file);
  if (!fs.existsSync(filePath)) {
    console.warn(`[inject-env] skip missing ${file}`);
    continue;
  }
  let html = fs.readFileSync(filePath, 'utf8');
  if (!html.includes(PLACEHOLDER)) {
    // Already injected or manually set
    if (KEY && html.includes(KEY)) {
      console.log(`[inject-env] ${file} already has key`);
    } else {
      console.warn(`[inject-env] ${file} has no placeholder — skipped`);
    }
    continue;
  }
  if (!KEY) {
    console.warn(`[inject-env] ${file} left with placeholder (no key)`);
    continue;
  }
  html = html.split(PLACEHOLDER).join(KEY);
  fs.writeFileSync(filePath, html, 'utf8');
  replaced += 1;
  console.log(`[inject-env] injected key into ${file}`);
}

console.log(`[inject-env] done (${replaced} file(s) updated)`);
