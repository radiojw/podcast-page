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

  if (duration.includes(":")) {
    const parts = duration.split(":").map((part) => part.trim())
    if (parts.length === 3) {
      const hours = Number(parts[0])
      const minutes = Number(parts[1])
      const seconds = Number(parts[2])
      if (hours > 0) {
        return `${hours}h ${minutes}m`
      }
      return `${minutes}:${seconds.toString().padStart(2, "0")}`
    }
    return duration.startsWith("00:") ? duration.slice(3) : duration
  }

  const secs = Number.parseInt(duration, 10)
  if (!Number.isNaN(secs)) {
    const minutes = Math.floor(secs / 60)
    const seconds = secs % 60
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  return duration
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