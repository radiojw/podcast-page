import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-brand-cream px-4 py-16">
      <div className="max-w-md text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-gold-dark">404</p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-zinc-950 sm:text-4xl">
          This place isn&apos;t on the map
        </h1>
        <p className="mt-4 text-base leading-relaxed text-zinc-600">
          That page doesn&apos;t exist, or the episode moved. Head back to the show and pick
          something from the archive.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center rounded-full bg-brand-forest px-5 py-2.5 text-sm font-bold text-white shadow-md transition-colors hover:bg-brand-forest-light focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
          >
            Back home
          </Link>
          <Link
            href="/#episodes"
            className="inline-flex min-h-11 items-center rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm font-bold text-brand-forest transition-colors hover:bg-brand-parchment focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-forest focus-visible:ring-offset-2"
          >
            Browse episodes
          </Link>
        </div>
      </div>
    </div>
  )
}
