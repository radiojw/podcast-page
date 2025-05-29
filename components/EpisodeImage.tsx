"use client"

import Image from "next/image"

interface EpisodeImageProps {
  src: string
  alt: string
  title: string
}

export default function EpisodeImage({ src, alt, title }: EpisodeImageProps) {
  return (
    <Image
      src={src || "/placeholder.svg"}
      alt={alt}
      layout="fill"
      objectFit="cover"
      onError={(e) => {
        console.error(`Error loading image for episode: ${title}`, e)
        e.currentTarget.src = "/placeholder.svg"
      }}
    />
  )
}
