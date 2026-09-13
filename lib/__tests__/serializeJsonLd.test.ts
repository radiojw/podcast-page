import { describe, expect, it } from "vitest"
import { serializeJsonLd } from "../serializeJsonLd"

describe("serializeJsonLd", () => {
  it("escapes <, >, and & so they cannot break out of a script tag", () => {
    const serialized = serializeJsonLd({
      name: "A <b>title</b> & more",
      html: "</script><script>alert(1)</script>",
    })

    expect(serialized).not.toContain("<")
    expect(serialized).not.toContain(">")
    expect(serialized).not.toContain("&")
    expect(serialized).toContain("\\u003c")
    expect(serialized).toContain("\\u003e")
    expect(serialized).toContain("\\u0026")
    expect(serialized.toLowerCase()).not.toContain("</script>")
  })

  it("escapes U+2028 and U+2029 line separators", () => {
    const serialized = serializeJsonLd({
      name: `line\u2028separator\u2029here`,
    })

    expect(serialized).not.toContain("\u2028")
    expect(serialized).not.toContain("\u2029")
    expect(serialized).toContain("\\u2028")
    expect(serialized).toContain("\\u2029")
  })
})
