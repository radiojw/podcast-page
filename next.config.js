/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: [
      "d3t3ozftmdmh3i.cloudfront.net",
      "anchor.fm",
      "i.scdn.co",
      "is1-ssl.mzstatic.com",
      "content.production.cdn.art19.com",
      "media.npr.org",
      "f.prxu.org",
      "assets.pippa.io",
      "megaphone.imgix.net",
      "static.megaphone.fm",
    ],
  },
  poweredByHeader: false,
  reactStrictMode: true,
}

module.exports = nextConfig
