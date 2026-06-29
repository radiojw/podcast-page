/** Single source of truth for site identity, canonical URL, and listen links. */

function normalizeUrl(raw: string): string {
  const withProtocol = /^https?:\/\//.test(raw) ? raw : `https://${raw}`
  return withProtocol.replace(/\/+$/, "")
}

/** Absolute, protocol-qualified, trailing-slash-free site origin. */
export const SITE_URL = normalizeUrl(
  process.env.NEXT_PUBLIC_BASE_URL || "https://whatisthisplace.org"
)

export const PODCAST_TITLE = "What Is This Place"
export const PODCAST_HOSTS = "Neil Real & Shredz Pali"
export const PODCAST_TAGLINE = `Travel podcast with ${PODCAST_HOSTS}`

export type PodcastPlatform = "spotify" | "apple"

export interface PodcastLink {
  href: string
  label: string
  platform: PodcastPlatform
  /** Tailwind classes for the branded pill button (hero). */
  bgClass: string
}

export const PODCAST_LINKS: readonly PodcastLink[] = [
  {
    href: "https://open.spotify.com/show/0bH1fyMB2MDdK8x2WAd7Uo",
    label: "Spotify",
    platform: "spotify",
    bgClass: "bg-[#1ed760] hover:bg-[#1db954] text-black",
  },
  {
    href: "https://podcasts.apple.com/us/podcast/what-is-this-place-travel-talk-radio/id1661457126?uo=4",
    label: "Apple Podcasts",
    platform: "apple",
    bgClass: "bg-[#fc3c44] hover:bg-[#d93037] text-white",
  },
]
