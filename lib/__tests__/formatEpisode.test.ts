import { describe, expect, it } from "vitest"
import { compareByPubDate, formatDuration, formatFileSize } from "../formatEpisode"

const ep = (pubDate: string) => ({ pubDate })

describe("compareByPubDate", () => {
  const older = ep("2025-01-01T00:00:00.000Z")
  const newer = ep("2025-06-01T00:00:00.000Z")

  it("orders newest-first by default", () => {
    expect([older, newer].sort((a, b) => compareByPubDate(a, b))).toEqual([newer, older])
  })

  it("orders oldest-first when requested", () => {
    expect([newer, older].sort((a, b) => compareByPubDate(a, b, "oldest"))).toEqual([older, newer])
  })

  it("pushes unparseable dates to the end regardless of direction", () => {
    const bad = ep("not-a-date")
    expect([bad, newer].sort((a, b) => compareByPubDate(a, b, "newest"))).toEqual([newer, bad])
    expect([bad, older].sort((a, b) => compareByPubDate(a, b, "oldest"))).toEqual([older, bad])
  })

  it("treats two invalid dates as equal", () => {
    expect(compareByPubDate(ep("x"), ep("y"))).toBe(0)
  })
})

describe("formatDuration", () => {
  it("formats raw seconds as m:ss", () => {
    expect(formatDuration("1830")).toBe("30:30")
  })

  it("collapses a leading zero hour from hh:mm:ss", () => {
    expect(formatDuration("00:42:10")).toBe("42:10")
  })

  it("returns empty string for missing duration", () => {
    expect(formatDuration(undefined)).toBe("")
  })

  it("does not echo untrusted non-duration strings", () => {
    expect(formatDuration("<script>alert(1)</script>")).toBe("")
    expect(formatDuration("not-a-duration")).toBe("")
    expect(formatDuration("10<img src=x onerror=alert(1)>")).toBe("")
    expect(formatDuration("javascript:alert(1)")).toBe("")
    expect(formatDuration("1h 2m")).toBe("")
    expect(formatDuration("12:34:56:78")).toBe("")
    expect(formatDuration("1e10")).toBe("")
    expect(formatDuration("-30")).toBe("")
  })
})

describe("formatFileSize", () => {
  it("formats bytes into human units", () => {
    expect(formatFileSize("1048576")).toBe("1.0 MB")
  })

  it("returns empty string for invalid/zero sizes", () => {
    expect(formatFileSize("0")).toBe("")
    expect(formatFileSize("nope")).toBe("")
    expect(formatFileSize(undefined)).toBe("")
  })
})
