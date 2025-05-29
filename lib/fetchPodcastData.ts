import { XMLParser } from "fast-xml-parser"

function formatText(str: string) {
  return str
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
}

function formatSummary(str: string) {
  let formatted = formatText(str)
  formatted = formatted.replace(/<[^>]*>/g, "")
  formatted = formatted.replace(/\s+/g, " ")
  formatted = formatted.trim()
  formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1)
  if (!formatted.endsWith(".")) {
    formatted += "."
  }
  return formatted
}

export async function fetchPodcastData(fetchAll = false) {
  try {
    console.log("Fetching podcast data...")

    // Add cache-busting parameter to ensure we get the latest data
    const timestamp = new Date().getTime()
    const response = await fetch(`https://anchor.fm/s/da593d5c/podcast/rss?t=${timestamp}`, {
      headers: {
        "User-Agent": "WhatIsThisPlacePodcast/1.0",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
      cache: "no-store", // Ensure Next.js doesn't cache this request
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const xmlData = await response.text()
    console.log("RSS feed fetched successfully")

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      parseAttributeValue: true,
      trimValues: true,
    })

    const result = parser.parse(xmlData)
    console.log("RSS feed parsed successfully")

    if (!result.rss || !result.rss.channel) {
      throw new Error("Invalid RSS feed structure")
    }

    const podcastSummary = formatSummary(result.rss.channel["itunes:summary"] || result.rss.channel.description || "")

    const mainImageUrl = result.rss.channel["itunes:image"]?.["@_href"]
    console.log("Main podcast image URL:", mainImageUrl)

    // Ensure we have an array of items
    const items = Array.isArray(result.rss.channel.item) ? result.rss.channel.item : [result.rss.channel.item]

    const allEpisodes = items
      .filter((item) => item && item.title) // Filter out any invalid items
      .map((item: any) => {
        console.log("Processing episode:", item.title)
        const episodeImageUrl = item["itunes:image"]?.["@_href"] || mainImageUrl
        console.log("Episode image URL:", episodeImageUrl)

        return {
          title: formatText(item.title),
          pubDate: item.pubDate,
          link: item.link,
          guid: item.guid?.["#text"] || item.guid || `episode-${Date.now()}-${Math.random()}`,
          summary: formatSummary(item["itunes:summary"] || item.description || ""),
          enclosure: item.enclosure
            ? {
                url: item.enclosure["@_url"] || "",
                type: item.enclosure["@_type"] || "",
                length: item.enclosure["@_length"] || "",
              }
            : null,
          imageUrl: episodeImageUrl,
        }
      })
      .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()) // Sort by date, newest first

    const episodes = fetchAll ? allEpisodes : allEpisodes.slice(0, 3)

    console.log(`Processed ${episodes.length} episodes (total available: ${allEpisodes.length})`)
    console.log("Latest episode:", episodes[0]?.title)

    return { podcastSummary, episodes }
  } catch (error) {
    console.error("Error fetching podcast data:", error)
    throw error
  }
}
