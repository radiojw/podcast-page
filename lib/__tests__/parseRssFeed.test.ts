import { describe, expect, it } from "vitest"
import { parseRssFeed, formatText, safeHttpsUrl } from "../parseRssFeed"
import { ALLOWED_AUDIO_HOSTS, ALLOWED_IMAGE_HOSTS, ALLOWED_LINK_HOSTS } from "../rssConstants"

const SAMPLE_FEED = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" version="2.0">
  <channel>
    <title><![CDATA[What Is This Place]]></title>
    <link>https://open.spotify.com/show/0bH1fyMB2MDdK8x2WAd7Uo</link>
    <description>Travel talk radio &amp; more</description>
    <lastBuildDate>Wed, 25 Jun 2025 12:00:00 GMT</lastBuildDate>
    <itunes:author>Neil Real &amp; Shredz Pali</itunes:author>
    <itunes:image href="https://d3t3ozftmdmh3i.cloudfront.net/cover.jpg" />
    <itunes:category text="Society &amp; Culture">
      <itunes:category text="Places &amp; Travel" />
    </itunes:category>
    <item>
      <title><![CDATA[Episode 2: The Newer One]]></title>
      <pubDate>Wed, 25 Jun 2025 12:00:00 GMT</pubDate>
      <link>https://open.spotify.com/episode/aaa</link>
      <guid isPermaLink="false">guid-aaa</guid>
      <description><![CDATA[<p>A <strong>great</strong> show.</p>]]></description>
      <itunes:episode>2</itunes:episode>
      <itunes:duration>1830</itunes:duration>
      <enclosure url="https://anchor.fm/s/abc/audio.mp3" type="audio/mpeg" length="1000000" />
    </item>
    <item>
      <title><![CDATA[Episode 1: The Older One]]></title>
      <pubDate>Tue, 24 Jun 2025 12:00:00 GMT</pubDate>
      <link>https://open.spotify.com/episode/bbb</link>
      <guid isPermaLink="false">guid-bbb</guid>
      <description>Older episode</description>
      <itunes:episode>1</itunes:episode>
      <enclosure url="https://anchor.fm/s/abc/older.mp3" type="audio/mpeg" length="900000" />
    </item>
  </channel>
</rss>`

describe("safeHttpsUrl", () => {
  it("accepts an https URL on an allowed host", () => {
    expect(safeHttpsUrl("https://anchor.fm/x.mp3", ALLOWED_AUDIO_HOSTS)).toBe(
      "https://anchor.fm/x.mp3"
    )
  })

  it("rejects http (non-TLS) URLs", () => {
    expect(safeHttpsUrl("http://anchor.fm/x.mp3", ALLOWED_AUDIO_HOSTS)).toBe("")
  })

  it("rejects hosts not in the allow-list", () => {
    expect(safeHttpsUrl("https://evil.example.com/x.mp3", ALLOWED_AUDIO_HOSTS)).toBe("")
  })

  it("returns empty string for malformed input", () => {
    expect(safeHttpsUrl("not a url", ALLOWED_IMAGE_HOSTS)).toBe("")
    expect(safeHttpsUrl(undefined)).toBe("")
  })
})

describe("formatText", () => {
  it("decodes common HTML entities", () => {
    expect(formatText("Neil &amp; Shredz")).toBe("Neil & Shredz")
    expect(formatText("&quot;quoted&quot;")).toBe('"quoted"')
  })

  it("decodes numeric entities for printable characters", () => {
    // &#233; = é
    expect(formatText("caf&#233;")).toBe("café")
  })

  it("replaces control/null numeric entities with a space (injection guard)", () => {
    expect(formatText("a&#0;b")).toBe("a b")
    // C1 control range
    expect(formatText("a&#130;b")).toBe("a b")
  })
})

describe("parseRssFeed", () => {
  const data = parseRssFeed(SAMPLE_FEED)

  it("parses channel-level metadata with CDATA and entities", () => {
    expect(data.podcastTitle).toBe("What Is This Place")
    expect(data.podcastAuthor).toBe("Neil Real & Shredz Pali")
    expect(data.podcastImage).toBe("https://d3t3ozftmdmh3i.cloudfront.net/cover.jpg")
  })

  it("builds nested category labels", () => {
    expect(data.podcastCategories).toContain("Society & Culture › Places & Travel")
  })

  it("returns all valid episodes, newest first", () => {
    expect(data.episodeCount).toBe(2)
    expect(data.episodes[0].guid).toBe("guid-aaa")
    expect(data.episodes[1].guid).toBe("guid-bbb")
  })

  it("strips HTML from descriptions into plain-text summaries", () => {
    expect(data.episodes[0].summary).toBe("A great show.")
    expect(data.episodes[0].summary).not.toContain("<")
  })

  it("keeps enclosure URLs only from allowed audio hosts", () => {
    expect(data.episodes[0].enclosure?.url).toBe("https://anchor.fm/s/abc/audio.mp3")
  })

  it("normalises pubDate to ISO and itunes:episode to a number", () => {
    expect(data.episodes[0].pubDate).toBe("2025-06-25T12:00:00.000Z")
    expect(data.episodes[0].episodeNumber).toBe(2)
  })

  it("throws on structurally invalid feeds", () => {
    expect(() => parseRssFeed("<not-rss/>")).toThrow()
  })

  it("drops a disallowed enclosure host", () => {
    const feed = SAMPLE_FEED.replace(
      "https://anchor.fm/s/abc/audio.mp3",
      "https://evil.example.com/audio.mp3"
    )
    const parsed = parseRssFeed(feed)
    const ep = parsed.episodes.find((e) => e.guid === "guid-aaa")
    expect(ep?.enclosure).toBeNull()
  })

  it("only allows whitelisted link hosts", () => {
    for (const ep of data.episodes) {
      const host = new URL(ep.link).hostname
      expect(ALLOWED_LINK_HOSTS.has(host)).toBe(true)
    }
  })
})
