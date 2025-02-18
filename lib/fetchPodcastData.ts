import { XMLParser } from "fast-xml-parser"

function formatText(str: string) {
  return str
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
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

export async function fetchPodcastData() {
  try {
    console.log("Fetching podcast data...")
    const response = await fetch("https://anchor.fm/s/da593d5c/podcast/rss")
    const xmlData = await response.text()
    console.log("RSS feed fetched successfully")

    const parser = new XMLParser()
    const result = parser.parse(xmlData)
    console.log("RSS feed parsed successfully")

    const podcastSummary = formatSummary(result.rss.channel["itunes:summary"] || result.rss.channel.description || "")

    const episodes = result.rss.channel.item.slice(0, 3).map((item: any) => {
      console.log("Processing episode:", item.title)
      return {
        title: formatText(item.title),
        pubDate: item["pubDate"],
        link: item.link,
        guid: item.guid,
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

    console.log("Processed episodes:", episodes)
    return { podcastSummary, episodes }
  } catch (error) {
    console.error("Error fetching podcast data:", error)
    throw error
  }
}

