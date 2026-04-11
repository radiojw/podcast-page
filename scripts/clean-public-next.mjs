import { existsSync } from "node:fs"
import { rm } from "node:fs/promises"
import path from "node:path"

const legacyPublicNext = path.join(process.cwd(), "public", "_next")

if (existsSync(legacyPublicNext)) {
  await rm(legacyPublicNext, { force: true, recursive: true })
  console.log("[prebuild] Removed legacy public/_next folder.")
}
