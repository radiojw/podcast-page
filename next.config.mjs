import { dirname } from "node:path"
import { fileURLToPath } from "node:url"

const projectRoot = dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  turbopack: {
    root: projectRoot,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "d3t3ozftmdmh3i.cloudfront.net" },
      { protocol: "https", hostname: "d3ctxlq1ktw2nl.cloudfront.net" },
      { protocol: "https", hostname: "anchor.fm" },
      { protocol: "https", hostname: "i.scdn.co" },
      { protocol: "https", hostname: "is1-ssl.mzstatic.com" },
      { protocol: "https", hostname: "content.production.cdn.art19.com" },
      { protocol: "https", hostname: "media.npr.org" },
      { protocol: "https", hostname: "f.prxu.org" },
      { protocol: "https", hostname: "assets.pippa.io" },
      { protocol: "https", hostname: "megaphone.imgix.net" },
      { protocol: "https", hostname: "static.megaphone.fm" },
    ],
  },

  compress: true,
  poweredByHeader: false,
}

export default nextConfig
