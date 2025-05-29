"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-white/10 backdrop-blur-sm shadow-md">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-white font-bold text-xl">
                What Is This Place
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === "/"
                    ? "border-white text-white"
                    : "border-transparent text-gray-300 hover:border-gray-300 hover:text-gray-100"
                }`}
              >
                Home
              </Link>
              <Link
                href="/all-episodes"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === "/all-episodes"
                    ? "border-white text-white"
                    : "border-transparent text-gray-300 hover:border-gray-300 hover:text-gray-100"
                }`}
              >
                All Episodes
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          <Link
            href="/"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              pathname === "/"
                ? "bg-purple-900/50 border-white text-white"
                : "border-transparent text-gray-300 hover:bg-purple-900/30 hover:border-gray-300 hover:text-gray-100"
            }`}
          >
            Home
          </Link>
          <Link
            href="/all-episodes"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              pathname === "/all-episodes"
                ? "bg-purple-900/50 border-white text-white"
                : "border-transparent text-gray-300 hover:bg-purple-900/30 hover:border-gray-300 hover:text-gray-100"
            }`}
          >
            All Episodes
          </Link>
        </div>
      </div>
    </nav>
  )
}
