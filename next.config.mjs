import { dirname } from "node:path"
import { fileURLToPath } from "node:url"

const projectRoot = dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
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
  async headers() {
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval';
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data: d3t3ozftmdmh3i.cloudfront.net d3ctxlq1ktw2nl.cloudfront.net anchor.fm i.scdn.co is1-ssl.mzstatic.com content.production.cdn.art19.com media.npr.org f.prxu.org assets.pippa.io megaphone.imgix.net static.megaphone.fm;
      media-src 'self' blob: data: anchor.fm d3t3ozftmdmh3i.cloudfront.net d3ctxlq1ktw2nl.cloudfront.net chtbl.com megaphone.fm media.rss.com;
      connect-src 'self' https://vitals.vercel-insights.com;
      font-src 'self';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      block-all-mixed-content;
      upgrade-insecure-requests;
    `.replace(/\s{2,}/g, " ").trim()

    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader,
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ]
  },
  compress: true,
  poweredByHeader: false,
}

export default nextConfig
