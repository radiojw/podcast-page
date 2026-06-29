import type { Episode } from "../types"

/** Convert arbitrary episode-title text into a URL-safe slug. */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/\p{M}/gu, "") // strip combining diacritics
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "")
}

/**
 * Build a stable guid -> slug map for the full episode list. Collisions are
 * disambiguated with a numeric suffix in list order, so the same input list
 * always yields the same slugs (important: generateStaticParams and the page
 * lookup must agree).
 */
export function buildEpisodeSlugs(episodes: Episode[]): Map<string, string> {
  const counts = new Map<string, number>()
  const result = new Map<string, string>()

  for (const episode of episodes) {
    const base = slugify(episode.title) || "episode"
    const seen = counts.get(base) ?? 0
    counts.set(base, seen + 1)
    result.set(episode.guid, seen === 0 ? base : `${base}-${seen + 1}`)
  }

  return result
}

/** An episode guaranteed to carry a resolved slug. */
export type EpisodeWithSlug = Episode & { slug: string }

/** Return a copy of each episode with its `slug` guaranteed-populated. */
export function withSlugs(episodes: Episode[]): EpisodeWithSlug[] {
  const slugs = buildEpisodeSlugs(episodes)
  // buildEpisodeSlugs assigns a slug for every guid in this list, so the get
  // is total here; fall back defensively just in case.
  return episodes.map((episode) => ({
    ...episode,
    slug: slugs.get(episode.guid) ?? (slugify(episode.title) || "episode"),
  }))
}

/** Find an episode by its computed slug. */
export function getEpisodeBySlug(episodes: Episode[], slug: string): Episode | undefined {
  const slugs = buildEpisodeSlugs(episodes)
  return episodes.find((episode) => slugs.get(episode.guid) === slug)
}
