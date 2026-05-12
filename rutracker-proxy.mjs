// @ts-nocheck
import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';

const app = express();
const port = Number(process.env.RUTRACKER_PROXY_PORT || 5050);

const credentials = {
  username: decodeBase64(process.env.RUTRACKER_USERNAME_B64 || ''),
  password: decodeBase64(process.env.RUTRACKER_PASSWORD_B64 || ''),
};
const cookieFilePath = path.resolve(
  process.cwd(),
  process.env.RUTRACKER_COOKIE_FILE || '.rutracker-cookies.json'
);

let cookieJar = new Map();
let sessionExpiresAt = 0;
const SESSION_TTL_MS = Number(process.env.RUTRACKER_SESSION_TTL_MS || 1000 * 60 * 60 * 12);

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/search', async (req, res) => {
  try {
    const search = String(req.query.nm || '').trim();
    if (!search) {
      res.status(400).json({ error: 'Missing query param: nm' });
      return;
    }

    if (!credentials.username || !credentials.password) {
      res.status(500).json({
        error:
          'Missing RuTracker credentials. Set RUTRACKER_USERNAME_B64 and RUTRACKER_PASSWORD_B64.',
      });
      return;
    }

    await ensureLoggedIn();
    let html = await ruTrackerGet(`/tracker.php?nm=${encodeURIComponent(search)}`);

    if (isCloudflareChallenge(html)) {
      clearSession();
      res.status(503).json({
        error:
          'RuTracker is currently protected by Cloudflare challenge. Node fetch cannot solve this challenge automatically.',
        code: 'CLOUDFLARE_CHALLENGE',
      });
      return;
    }

    if (isLoginRequired(html)) {
      clearSession();
      await ensureLoggedIn();
      html = await ruTrackerGet(`/tracker.php?nm=${encodeURIComponent(search)}`);
    }

    res.type('text/html').send(html);
  } catch (error) {
    console.error('RuTracker proxy search error', error);
    if (String(error?.message || '').includes('CLOUDFLARE_CHALLENGE')) {
      res.status(503).json({
        error:
          'RuTracker is currently protected by Cloudflare challenge. Node fetch cannot solve this challenge automatically.',
        code: 'CLOUDFLARE_CHALLENGE',
      });
      return;
    }
    res.status(500).json({ error: 'RuTracker proxy failed to fetch search results.' });
  }
});

app.listen(port, () => {
  console.log(`RuTracker proxy listening on http://localhost:${port}`);
});

await loadPersistedCookies();

async function ensureLoggedIn() {
  if (Date.now() < sessionExpiresAt && cookieJar.size > 0) {
    return;
  }

  const loginPage = await ruTrackerGet('/login.php');
  if (isCloudflareChallenge(loginPage)) {
    throw new Error('CLOUDFLARE_CHALLENGE');
  }
  const payload = extractHiddenInputs(loginPage);
  payload.set('login_username', credentials.username);
  payload.set('login_password', credentials.password);
  payload.set('login', 'login');

  const responseHtml = await ruTrackerPost('/login.php', payload.toString());
  if (isCloudflareChallenge(responseHtml)) {
    throw new Error('CLOUDFLARE_CHALLENGE');
  }
  if (isLoginRequired(responseHtml)) {
    throw new Error('Login failed. Check RuTracker credentials.');
  }

  sessionExpiresAt = Date.now() + SESSION_TTL_MS;
}

async function ruTrackerGet(path) {
  const response = await fetch(`https://rutracker.org/forum${path}`, {
    method: 'GET',
    headers: {
      cookie: buildCookieHeader(),
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
    redirect: 'follow',
  });
  updateCookieJar(response);
  return response.text();
}

async function ruTrackerPost(path, body) {
  const response = await fetch(`https://rutracker.org/forum${path}`, {
    method: 'POST',
    headers: {
      cookie: buildCookieHeader(),
      'content-type': 'application/x-www-form-urlencoded',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
    body,
    redirect: 'follow',
  });
  updateCookieJar(response);
  return response.text();
}

function updateCookieJar(response) {
  const setCookies = response.headers.getSetCookie?.() || splitSetCookie(response.headers.get('set-cookie'));
  for (const setCookie of setCookies) {
    const [pair] = setCookie.split(';');
    const separatorIndex = pair.indexOf('=');
    if (separatorIndex <= 0) continue;
    const name = pair.slice(0, separatorIndex).trim();
    const value = pair.slice(separatorIndex + 1).trim();
    if (!name) continue;
    cookieJar.set(name, value);
  }
}

function buildCookieHeader() {
  if (cookieJar.size === 0) return '';
  return Array.from(cookieJar.entries())
    .map(([name, value]) => `${name}=${value}`)
    .join('; ');
}

function clearSession() {
  cookieJar = new Map();
  sessionExpiresAt = 0;
}

async function loadPersistedCookies() {
  try {
    const raw = await fs.readFile(cookieFilePath, 'utf-8');
    const cookies = JSON.parse(raw);
    if (!Array.isArray(cookies)) {
      return;
    }

    for (const cookie of cookies) {
      if (!cookie?.name) continue;
      cookieJar.set(cookie.name, String(cookie.value || ''));
    }

    if (cookieJar.size > 0) {
      sessionExpiresAt = Date.now() + SESSION_TTL_MS;
      console.log(`Loaded ${cookieJar.size} cookie(s) from ${cookieFilePath}`);
    }
  } catch {
    // Cookie file is optional
  }
}

function extractHiddenInputs(html) {
  const payload = new URLSearchParams();
  const hiddenInputRegex = /<input[^>]*type=["']hidden["'][^>]*>/gi;
  const nameRegex = /name=["']([^"']+)["']/i;
  const valueRegex = /value=["']([^"']*)["']/i;

  for (const tag of html.match(hiddenInputRegex) || []) {
    const nameMatch = tag.match(nameRegex);
    if (!nameMatch) continue;
    const valueMatch = tag.match(valueRegex);
    payload.set(nameMatch[1], valueMatch ? decodeHtml(valueMatch[1]) : '');
  }

  return payload;
}

function isLoginRequired(html) {
  return (
    html.includes('name="login_username"') ||
    html.includes('name="login_password"') ||
    html.includes('form action="login.php"')
  );
}

function isCloudflareChallenge(html) {
  if (!html) return false;
  return (
    html.includes('/cdn-cgi/challenge-platform/') ||
    html.includes('__CF$cv$params') ||
    html.includes('cf_chl_opt') ||
    html.includes('Just a moment')
  );
}

function splitSetCookie(header) {
  if (!header) return [];
  return header
    .split(/,(?=\s*[^;]+=[^;]+)/g)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function decodeBase64(value) {
  if (!value) return '';
  try {
    return Buffer.from(value, 'base64').toString('utf-8');
  } catch {
    return '';
  }
}

function decodeHtml(value) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}
