/**
 * Compare two episodes by publish date, pushing entries with unparseable dates
 * to the end regardless of direction. Shared by the feed parser and the UI sort
 * so ordering stays consistent (and NaN-safe) everywhere.
 */
export function compareByPubDate(
  a: { pubDate: string },
  b: { pubDate: string },
  direction: "newest" | "oldest" = "newest"
) {
  const aTime = new Date(a.pubDate).getTime()
  const bTime = new Date(b.pubDate).getTime()
  const aInvalid = Number.isNaN(aTime)
  const bInvalid = Number.isNaN(bTime)

  if (aInvalid && bInvalid) return 0
  if (aInvalid) return 1
  if (bInvalid) return -1
  return direction === "newest" ? bTime - aTime : aTime - bTime
}

export function formatEpisodeDate(date: string) {
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) {
    return "Date unavailable"
  }
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(parsed)
}

export function formatDuration(duration?: string) {
  if (!duration) return ""

  const value = duration.trim()
  if (!value) return ""

  if (value.includes(":")) {
    const parts = value.split(":").map((part) => part.trim())
    if (!parts.every((part) => /^\d{1,4}$/.test(part))) {
      return ""
    }

    const nums = parts.map(Number)
    if (parts.length === 3) {
      const [hours, minutes, seconds] = nums
      if (hours > 0) {
        return `${hours}h ${minutes}m`
      }
      return `${minutes}:${seconds.toString().padStart(2, "0")}`
    }
    if (parts.length === 2) {
      const [minutes, seconds] = nums
      return `${minutes}:${seconds.toString().padStart(2, "0")}`
    }
    return ""
  }

  // Reject garbage / XSS-like strings: the whole value must be a non-negative integer.
  if (!/^\d{1,8}$/.test(value)) {
    return ""
  }

  const secs = Number.parseInt(value, 10)
  const minutes = Math.floor(secs / 60)
  const seconds = secs % 60
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
}

/** Convert an RSS duration (seconds or h:mm:ss) into schema.org ISO-8601. */
export function durationToIso8601(duration?: string): string | undefined {
  if (!duration) return undefined

  const value = duration.trim()
  if (!value) return undefined

  let totalSeconds: number | null = null

  if (value.includes(":")) {
    const parts = value.split(":").map((part) => part.trim())
    if (!parts.every((part) => /^\d{1,4}$/.test(part))) {
      return undefined
    }
    const nums = parts.map(Number)
    if (parts.length === 3) {
      totalSeconds = nums[0] * 3600 + nums[1] * 60 + nums[2]
    } else if (parts.length === 2) {
      totalSeconds = nums[0] * 60 + nums[1]
    } else {
      return undefined
    }
  } else if (/^\d{1,8}$/.test(value)) {
    totalSeconds = Number.parseInt(value, 10)
  } else {
    return undefined
  }

  if (totalSeconds === null || !Number.isFinite(totalSeconds) || totalSeconds < 0) {
    return undefined
  }

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) return `PT${hours}H${minutes}M${seconds}S`
  if (minutes > 0) return `PT${minutes}M${seconds}S`
  return `PT${seconds}S`
}

export function extractEpisodeNumber(title: string) {
  const match = title.match(/(?:episode|ep\.?)\s*(\d+)/i)
  return match ? match[1] : null
}

export function getEpisodeLabel(episode: {
  episodeNumber?: number
  seasonNumber?: number
  title: string
}) {
  if (episode.episodeNumber) {
    return episode.seasonNumber
      ? `S${episode.seasonNumber} · Ep. ${episode.episodeNumber}`
      : `Ep. ${episode.episodeNumber}`
  }

  const fromTitle = extractEpisodeNumber(episode.title)
  return fromTitle ? `Ep. ${fromTitle}` : null
}

export function formatFileSize(bytes?: string) {
  if (!bytes) return ""

  const size = Number.parseInt(bytes, 10)
  if (!Number.isFinite(size) || size <= 0) return ""

  const units = ["B", "KB", "MB", "GB"]
  let value = size
  let unitIndex = 0

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }

  return `${value >= 10 || unitIndex === 0 ? Math.round(value) : value.toFixed(1)} ${units[unitIndex]}`
}

export function formatFeedDate(date?: string) {
  if (!date) return null

  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) {
    return null
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed)
}