import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { firefox } from 'playwright-core';

const cookieFilePath = path.resolve(
  process.cwd(),
  process.env.RUTRACKER_COOKIE_FILE || '.rutracker-cookies.json'
);

console.log('Opening RuTracker. Solve Cloudflare/login in the browser window.');
console.log('When done, return here and press ENTER to save cookies.');

const browser = await firefox.launch({
  headless: false,
});

const context = await browser.newContext();

try {
  const page = await context.newPage();

  // Ensure the browser opens the correct URL
  await page.goto('https://rutracker.org/forum/login.php', {
    waitUntil: 'domcontentloaded',
    timeout: 120000,
  });

  console.log('Browser tab opened in Firefox. Please solve the Cloudflare challenge in the browser.');

  // Wait for user input to proceed
  await waitForEnter();

  const cookies = await context.cookies('https://rutracker.org', 'https://rutracker.org/forum');

  const filteredCookies = cookies.filter((cookie) => cookie.domain.includes('rutracker.org'));
  if (!filteredCookies.length) {
    console.warn('No rutracker.org cookies found. Did you solve challenge/login before pressing ENTER?');
  }

  await fs.writeFile(cookieFilePath, JSON.stringify(filteredCookies, null, 2), 'utf-8');
  console.log(`Saved ${filteredCookies.length} cookies to ${cookieFilePath}`);
} finally {
  await browser.close();
}

function waitForEnter() {
  return new Promise((resolve) => {
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.once('data', () => {
      resolve();
    });
  });
}
