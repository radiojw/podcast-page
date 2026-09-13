/** Single source of truth for site identity, canonical URL, and listen links. */

const DEFAULT_SITE_URL = "https://whatisthisplace.org"

/**
 * Resolve a build-time origin. Rejects credentials, non-https hosts (except
 * loopback for local previews), and non-default https ports so a poisoned
 * NEXT_PUBLIC_BASE_URL cannot rewrite canonical URLs or JSON-LD.
 */
export function resolveSiteUrl(raw: string | undefined): string {
  if (!raw?.trim()) {
    return DEFAULT_SITE_URL
  }

  try {
    const trimmed = raw.trim()
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
    const url = new URL(withProtocol)

    if (url.username || url.password) {
      return DEFAULT_SITE_URL
    }

    const hostname = url.hostname.replace(/\.$/, "").toLowerCase()
    const isLoopback =
      hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]"

    if (isLoopback) {
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        return DEFAULT_SITE_URL
      }
      return url.origin.replace(/\/+$/, "")
    }

    if (url.protocol !== "https:") {
      return DEFAULT_SITE_URL
    }

    if (url.port && url.port !== "443") {
      return DEFAULT_SITE_URL
    }

    return `https://${hostname}`
  } catch {
    return DEFAULT_SITE_URL
  }
}

/** Absolute, protocol-qualified, trailing-slash-free site origin. */
export const SITE_URL = resolveSiteUrl(process.env.NEXT_PUBLIC_BASE_URL)

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
