import { describe, expect, it } from "vitest"
import { slugify, buildEpisodeSlugs, getEpisodeBySlug, withSlugs } from "../episodeSlug"
import type { Episode } from "../../types"

const makeEpisode = (guid: string, title: string): Episode => ({
  title,
  pubDate: "2025-01-01T00:00:00.000Z",
  link: "https://open.spotify.com/episode/x",
  guid,
  summary: "Summary.",
  enclosure: null,
})

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("Episode 2: The Newer One")).toBe("episode-2-the-newer-one")
  })

  it("strips diacritics", () => {
    expect(slugify("Café René")).toBe("cafe-rene")
  })

  it("trims leading/trailing separators and collapses punctuation", () => {
    expect(slugify("  !!Hello, World!!  ")).toBe("hello-world")
  })

  it("caps length at 80 chars without a trailing dash", () => {
    const slug = slugify("a ".repeat(100))
    expect(slug.length).toBeLessThanOrEqual(80)
    expect(slug.endsWith("-")).toBe(false)
  })
})

describe("buildEpisodeSlugs", () => {
  it("produces unique slugs for duplicate titles", () => {
    const episodes = [
      makeEpisode("g1", "Same Title"),
      makeEpisode("g2", "Same Title"),
      makeEpisode("g3", "Same Title"),
    ]
    const slugs = buildEpisodeSlugs(episodes)
    expect([...slugs.values()]).toEqual(["same-title", "same-title-2", "same-title-3"])
  })

  it("falls back to 'episode' for empty/symbol-only titles", () => {
    const slugs = buildEpisodeSlugs([makeEpisode("g1", "!!!")])
    expect(slugs.get("g1")).toBe("episode")
  })

  it("is deterministic across calls", () => {
    const episodes = [makeEpisode("g1", "One"), makeEpisode("g2", "One")]
    expect([...buildEpisodeSlugs(episodes)]).toEqual([...buildEpisodeSlugs(episodes)])
  })
})

describe("getEpisodeBySlug / withSlugs", () => {
  const episodes = [makeEpisode("g1", "First"), makeEpisode("g2", "First")]

  it("round-trips slug -> episode", () => {
    expect(getEpisodeBySlug(episodes, "first")?.guid).toBe("g1")
    expect(getEpisodeBySlug(episodes, "first-2")?.guid).toBe("g2")
  })

  it("returns undefined for an unknown slug", () => {
    expect(getEpisodeBySlug(episodes, "nope")).toBeUndefined()
  })

  it("withSlugs attaches matching slugs", () => {
    const enriched = withSlugs(episodes)
    expect(enriched[0].slug).toBe("first")
    expect(enriched[1].slug).toBe("first-2")
  })
})
