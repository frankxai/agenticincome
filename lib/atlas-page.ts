/**
 * Turns the generated vault atlas (an HTML fragment built for Claude artifacts) into a full
 * document for the internal /atlas route. Pure, so the route and the node tests agree.
 */

/** Internal only: served on preview and local builds, 404 in production until Frank decides otherwise. */
export function atlasEnabled(env: { VERCEL_ENV?: string }): boolean {
  return env.VERCEL_ENV !== 'production'
}

// The site CSP allows styles and fonts from 'self' only, so the Google Fonts links would be
// blocked anyway; dropping them leaves the template's system font fallbacks with no CSP errors.
const FONT_LINK = /<link\b[^>]*\bhref="https:\/\/fonts\.(googleapis|gstatic)\.com[^"]*"[^>]*>\s*/g
const VIEWPORT_SIDES = /<meta name="claude:viewport-fit-sides"[^>]*>\s*/

const HEAD_PARTS = /^\s*(<title>[\s\S]*?<\/title>)\s*([\s\S]*?)(<style>[\s\S]*?<\/style>)/

/** Wraps the fragment: title and styles go in <head>, the rest in <body>. */
export function atlasDocument(fragment: string): string {
  const cleaned = fragment.replace(FONT_LINK, '').replace(VIEWPORT_SIDES, '')
  const head = HEAD_PARTS.exec(cleaned)
  const title = head ? head[1] : '<title>Economy Atlas</title>'
  const style = head ? head[3] : ''
  const body = head ? cleaned.slice(head[0].length) : cleaned
  return [
    '<!doctype html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">',
    '<meta name="robots" content="noindex, nofollow">',
    // Matches the template's --bg token in each theme.
    '<meta name="theme-color" content="#f6f7f9" media="(prefers-color-scheme: light)">',
    '<meta name="theme-color" content="#05060a" media="(prefers-color-scheme: dark)">',
    title,
    // The artifact host normally supplies this reset; the template's own styles build on it.
    '<style>body{margin:0;font:14px system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}</style>',
    style,
    '</head>',
    '<body>',
    body.trim(),
    '</body>',
    '</html>',
    '',
  ].join('\n')
}
