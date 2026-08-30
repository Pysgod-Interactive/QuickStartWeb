// Kill switches for this site, read from Cloudflare Flagship. These are the
// same Flagship apps epictoolsonline.com uses, so toggling a flag from the
// Cloudflare dashboard affects both sites at once.
//
// full-kill-switch  -> everything Pysgod Interactive runs goes offline
// eto-quickstart-kill -> just this site
//
// Any read failure (missing binding, network hiccup) is treated as "not
// killed" so a Flagship problem can never accidentally take the site down.

import logoMarkup from "../assets/logo.svg?raw";
import { pysgodMark } from "./pysgod-mark";

const RED = "#b8433a";
const pysgodMarkRed = pysgodMark(RED);

async function readFlag(binding, key) {
  try {
    return await binding.getBooleanValue(key, false, {});
  } catch {
    return false;
  }
}

export async function isKilled(env) {
  if (env?.KILL_FULL && (await readFlag(env.KILL_FULL, "full-kill-switch"))) {
    return true;
  }
  if (env?.KILL_SCOPED && (await readFlag(env.KILL_SCOPED, "eto-quickstart-kill"))) {
    return true;
  }
  return false;
}

export function offlinePage() {
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>QuickStart is offline</title>
<meta name="robots" content="noindex" />
<style>
  :root { color-scheme: dark; }
  body {
    margin: 0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    background: #1c1a16;
    color: ${RED};
    font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
    text-align: center;
    padding: 2rem;
  }
  /* logo.svg already bakes the word "QuickStart" into the artwork, same as
     epictoolsonline.com's mark does, so it's shown alone, no text beside it. */
  .logo-mark svg { width: min(60vw, 260px); height: auto; }
  .message {
    max-width: 40rem;
    font-size: 1.05rem;
    font-weight: 700;
    line-height: 1.5;
    margin: 0.5rem 0 0;
  }
  .pysgod-link {
    display: inline-flex;
    text-decoration: none;
    opacity: 0.92;
  }
  .pysgod-link:hover { opacity: 1; }
  .pysgod-link svg { width: min(40vw, 150px); height: auto; }
</style>
</head>
<body>
  <div class="logo-mark" aria-hidden="true">${logoMarkup}</div>
  <p class="message">QuickStart is temporarily offline on behalf of Pysgod Interactive.</p>
  <a class="pysgod-link" href="https://status.pysgod.xyz" aria-label="Pysgod Interactive">
    ${pysgodMarkRed}
  </a>
</body>
</html>
`;
  return new Response(html, {
    status: 503,
    headers: { "content-type": "text/html; charset=utf-8", "retry-after": "120" },
  });
}
