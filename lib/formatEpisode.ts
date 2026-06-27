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