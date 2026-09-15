"use client"

import { useEffect, useState } from "react"
import { Check, Share2 } from "lucide-react"
import { episodePath } from "@/lib/episodeSlug"

interface ShareEpisodeButtonProps {
  slug: string
  title: string
  guid: string
  className?: string
}

export default function ShareEpisodeButton({
  slug,
  title,
  guid,
  className = "inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-forest focus-visible:ring-offset-2",
}: ShareEpisodeButtonProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const url = `${window.location.origin}${episodePath(slug)}`

    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title, url, text: title })
        return
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return
      }
    }

    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
    } catch (err) {
      console.error("Failed to copy episode link:", err)
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className={className}
      title="Share this episode"
      data-episode-guid={guid}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-emerald-600" />
          <span className="text-emerald-600">Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="h-3.5 w-3.5" />
          <span>Share</span>
        </>
      )}
    </button>
  )
}
