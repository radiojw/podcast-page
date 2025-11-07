import { XMLParser } from "fast-xml-parser"

const FETCH_TIMEOUT = 15000 // 15 seconds

function formatText(str: string) {
  if (!str) return ""
  return str
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
}

function formatSummary(str: string) {
  if (!str) return "No description available."
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

export async function fetchPodcastData() {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT)

  try {
    console.log("[podcast] Fetching podcast data from RSS feed...")
    const response = await fetch("https://anchor.fm/s/da593d5c/podcast/rss", {
      cache: "no-store",
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; WhatIsThisPlace/1.0)",
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const xmlData = await response.text()
    console.log("[podcast] RSS feed fetched successfully")

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    })

    const result = parser.parse(xmlData)
    console.log("[podcast] RSS feed parsed successfully")

    if (!result.rss || !result.rss.channel) {
      throw new Error("Invalid RSS feed structure")
    }

    const podcastSummary = formatSummary(result.rss.channel["itunes:summary"] || result.rss.channel.description || "")

    // Ensure we have an array of items
    const items = Array.isArray(result.rss.channel.item) ? result.rss.channel.item : [result.rss.channel.item]

    const episodes = items.slice(0, 5).map((item: any) => {
      return {
        title: formatText(item.title),
        pubDate: item.pubDate,
        link: item.link,
        guid: typeof item.guid === "string" ? item.guid : item.guid?.["#text"] || `episode-${Date.now()}`,
        summary: formatSummary(item["itunes:summary"] || item.description || ""),
        enclosure: item.enclosure
          ? {
              url: item.enclosure["@_url"] || "",
              type: item.enclosure["@_type"] || "",
              length: item.enclosure["@_length"] || "",
            }
          : null,
      }
    })

    console.log(`[podcast] Successfully processed ${episodes.length} episodes`)
    return { podcastSummary, episodes }
  } catch (error) {
    clearTimeout(timeoutId)

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        console.error("[podcast] Request timeout while fetching RSS feed")
      } else {
        console.error("[podcast] Error fetching podcast data:", error.message)
      }
    } else {
      console.error("[podcast] Unknown error fetching podcast data")
    }

    // Return empty data structure instead of throwing
    return {
      podcastSummary: "Join Neil Real and Shredz Pali as they explore unique destinations in their travel podcast.",
      episodes: [],
    }
  }
}
