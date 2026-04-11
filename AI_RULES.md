# AI Rules for "What Is This Place" Application

This document outlines the core technologies and libraries used in this project, along with guidelines for their appropriate use.

## Tech Stack Overview

1. **Next.js:** The primary React framework for building the app, routing, metadata, rendering, and standalone production output.
2. **React:** The JavaScript library for component logic and rendering.
3. **TypeScript:** All application code is written in TypeScript for type safety and improved developer experience.
4. **Tailwind CSS:** A utility-first CSS framework used for component styling.
5. **fast-xml-parser:** Used specifically for parsing the podcast RSS feed.
6. **lucide-react:** Used for SVG icons.
7. **@vercel/analytics:** Integrated for anonymous usage and performance metrics.
8. **Native HTML Audio:** The `<audio>` HTML element is used for playing podcast episodes directly in the browser.

## Library Usage Guidelines

- **Application Framework:** Use Next.js for page-level components, metadata, and server-side logic.
- **UI Components:** Prefer small custom components styled with Tailwind CSS. Do not add a component library unless the app gains repeated UI patterns that justify it.
- **Styling:** Use Tailwind CSS utility classes for component styling. Keep custom CSS limited to global resets and truly shared base styles.
- **Icons:** Use lucide-react for icons.
- **XML Parsing:** Use fast-xml-parser for RSS/XML data.
- **Analytics:** @vercel/analytics is already integrated. Do not add other analytics libraries unless specifically requested.
- **Audio Playback:** Use the native HTML `<audio>` element. Avoid third-party audio player libraries unless a specific advanced feature is required.
- **State Management:** Prefer React's built-in hooks for client-side state. Avoid external state management libraries unless the application complexity explicitly demands it.
- **Routing:** Use Next.js file-system routing in the `app/` directory.
- **Dependencies:** Keep dependencies intentionally small. Avoid reintroducing broad generated-project dependency sets unless they are actively used.
