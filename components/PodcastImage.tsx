"use client"

import Image from "next/image"
import { useState } from "react"

interface PodcastImageProps {
  src: string
  alt: string
  title: string
}

export default function PodcastImage({ src, alt, title }: PodcastImageProps) {
  const [imgSrc, setImgSrc] = useState(src)

  return (
    <Image
      src={imgSrc || "/placeholder.svg"}
      alt={alt}
      layout="fill"
      objectFit="cover"
      onError={() => {
        console.error(`Error loading image for episode: ${title}`)
        setImgSrc("/placeholder.svg")
      }}
      loading="lazy"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  )
}
