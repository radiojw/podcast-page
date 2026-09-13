import { describe, expect, it } from "vitest"
import { resolveSiteUrl } from "../siteConfig"

const DEFAULT_SITE_URL = "https://whatisthisplace.org"

describe("resolveSiteUrl", () => {
  it("falls back to the default origin when the value is missing", () => {
    expect(resolveSiteUrl(undefined)).toBe(DEFAULT_SITE_URL)
    expect(resolveSiteUrl("")).toBe(DEFAULT_SITE_URL)
    expect(resolveSiteUrl("   ")).toBe(DEFAULT_SITE_URL)
  })

  it("accepts a normal https origin", () => {
    expect(resolveSiteUrl("https://whatisthisplace.org")).toBe(DEFAULT_SITE_URL)
    expect(resolveSiteUrl("https://whatisthisplace.org/")).toBe(DEFAULT_SITE_URL)
  })

  it("rejects javascript: URLs", () => {
    expect(resolveSiteUrl("javascript:alert(1)")).toBe(DEFAULT_SITE_URL)
    expect(resolveSiteUrl("javascript:https://evil.example")).toBe(DEFAULT_SITE_URL)
  })

  it("rejects credentials in the URL", () => {
    expect(resolveSiteUrl("https://user:pass@whatisthisplace.org")).toBe(DEFAULT_SITE_URL)
    expect(resolveSiteUrl("https://user@whatisthisplace.org")).toBe(DEFAULT_SITE_URL)
  })

  it("rejects http on non-loopback hosts", () => {
    expect(resolveSiteUrl("http://whatisthisplace.org")).toBe(DEFAULT_SITE_URL)
    expect(resolveSiteUrl("http://example.com")).toBe(DEFAULT_SITE_URL)
    expect(resolveSiteUrl("http://192.168.1.10")).toBe(DEFAULT_SITE_URL)
  })

  it("allows http/https on loopback for local previews", () => {
    expect(resolveSiteUrl("http://localhost:3000")).toBe("http://localhost:3000")
    expect(resolveSiteUrl("http://127.0.0.1:3000")).toBe("http://127.0.0.1:3000")
  })

  it("rejects non-default https ports", () => {
    expect(resolveSiteUrl("https://whatisthisplace.org:8443")).toBe(DEFAULT_SITE_URL)
    expect(resolveSiteUrl("https://whatisthisplace.org:444")).toBe(DEFAULT_SITE_URL)
  })
})
