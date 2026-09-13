/**
 * Serialize JSON-LD for embedding in a <script> tag.
 *
 * Untrusted RSS strings can include `</script>`, HTML, or U+2028/U+2029 line
 * separators. JSON.stringify alone leaves those line separators intact, which
 * can terminate a script element in HTML. Escape the characters that would
 * break out of the script context.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029")
}
