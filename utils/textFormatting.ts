export function formatText(text: string): string {
  return text.replace(/&#39;/g, "'")
}
