import { existsSync } from "node:fs"
import { cp, mkdir, rm } from "node:fs/promises"
import path from "node:path"

const source = path.join(process.cwd(), ".next", "static")
const standaloneDir = path.join(process.cwd(), ".next", "standalone")
const target = path.join(standaloneDir, ".next", "static")
const publicSource = path.join(process.cwd(), "public")
const publicTarget = path.join(standaloneDir, "public")

if (!existsSync(source)) {
  console.warn("[postbuild] Skipping static asset copy because .next/static does not exist.")
  process.exit(0)
}

await rm(target, { force: true, recursive: true })
await mkdir(path.dirname(target), { recursive: true })
await cp(source, target, { recursive: true })

if (existsSync(publicSource)) {
  await rm(publicTarget, { force: true, recursive: true })
  await cp(publicSource, publicTarget, { recursive: true })
}

console.log("[postbuild] Copied static assets into .next/standalone.")
