"use client"

import { useState } from "react"

interface EpisodeSummaryProps {
  summary: string
  preview?: string
  className?: string
  clampClassName?: string
}

export default function EpisodeSummary({
  summary,
  preview,
  className = "text-sm leading-relaxed text-zinc-600",
  clampClassName = "line-clamp-3",
}: EpisodeSummaryProps) {
  const [expanded, setExpanded] = useState(false)
  const hasPreview = Boolean(preview && preview !== summary)

  if (!hasPreview) {
    return <p className={`${className} ${clampClassName}`}>{summary}</p>
  }

  return (
    <div>
      <p className={className}>{expanded ? summary : preview}</p>
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="mt-2 rounded text-xs font-bold text-brand-forest transition-colors hover:text-brand-forest-light focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-forest focus-visible:ring-offset-2"
      >
        {expanded ? "Show less" : "Read more"}
      </button>
    </div>
  )
}