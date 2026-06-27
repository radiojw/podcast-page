export const RSS_URL = "https://anchor.fm/s/da593d5c/podcast/rss"
export const FETCH_TIMEOUT = 15000

export const FALLBACK_TITLE = "What Is This Place"
export const FALLBACK_SUMMARY =
  "Join Neil Real and Shredz Pali as they explore unique destinations in their travel podcast."
export const FALLBACK_COVER_ART =
  "https://d3t3ozftmdmh3i.cloudfront.net/staging/podcast_uploaded_nologo/36532815/0dbb8f8a71dd4b7c.jpeg"
export const FALLBACK_SHOW_LINK = "https://open.spotify.com/show/0bH1fyMB2MDdK8x2WAd7Uo"

export const ALLOWED_LINK_HOSTS = new Set([
  "anchor.fm",
  "podcasters.spotify.com",
  "open.spotify.com",
  "spotify.com",
  "whatisthisplace.org",
])

export const ALLOWED_AUDIO_HOSTS = new Set([
  "anchor.fm",
  "d3t3ozftmdmh3i.cloudfront.net",
  "d3ctxlq1ktw2nl.cloudfront.net",
  "chtbl.com",
  "megaphone.fm",
  "media.rss.com",
])

export const ALLOWED_IMAGE_HOSTS = new Set([
  "d3t3ozftmdmh3i.cloudfront.net",
  "d3ctxlq1ktw2nl.cloudfront.net",
  "anchor.fm",
  "i.scdn.co",
  "is1-ssl.mzstatic.com",
  "content.production.cdn.art19.com",
  "media.npr.org",
  "f.prxu.org",
  "assets.pippa.io",
  "megaphone.imgix.net",
  "static.megaphone.fm",
])