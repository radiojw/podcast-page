# AI Rules for "What Is This Place" Application

This document outlines the core technologies and libraries used in this project, along with guidelines for their appropriate use.

## Tech Stack Overview

1.  **Next.js:** The primary React framework for building server-rendered and static web applications. It handles routing, API routes, and server-side rendering.
2.  **React:** The JavaScript library for building user interfaces, used for all component logic and rendering.
3.  **TypeScript:** All application code is written in TypeScript for type safety and improved developer experience.
4.  **Tailwind CSS:** A utility-first CSS framework used for all styling. All components should be styled using Tailwind classes.
5.  **shadcn/ui:** A collection of re-usable components built with Radix UI and Tailwind CSS. These components are preferred for common UI elements.
6.  **fast-xml-parser:** Used specifically for parsing XML data, primarily for RSS feeds.
7.  **lucide-react:** A library providing a set of beautiful and customizable SVG icons.
8.  **date-fns:** A modern JavaScript date utility library for parsing, validating, manipulating, and formatting dates.
9.  **@vercel/analytics:** Integrated for collecting anonymous usage data and performance metrics.
10. **Native HTML Audio:** The `<audio>` HTML element is used for playing podcast episodes directly in the browser.

## Library Usage Guidelines

*   **Application Framework:** Use **Next.js** for all page-level components, API routes, and server-side logic.
*   **UI Components:** Prioritize **shadcn/ui** components for standard UI elements (e.g., buttons, cards, dialogs). If a specific component is not available in shadcn/ui or requires significant customization, create a new custom component using Tailwind CSS.
*   **Styling:** All styling must be done using **Tailwind CSS** utility classes. Avoid writing custom CSS files unless absolutely necessary for global styles or third-party library overrides.
*   **Icons:** Use **lucide-react** for all icons within the application.
*   **XML Parsing:** When dealing with XML data (like RSS feeds), use **fast-xml-parser**.
*   **Date Manipulation:** For any date formatting, parsing, or manipulation tasks, use **date-fns**.
*   **Analytics:** **@vercel/analytics** is already integrated for performance monitoring. Do not add other analytics libraries unless specifically requested.
*   **Audio Playback:** The native HTML `<audio>` element is the preferred method for playing audio files. Avoid third-party audio player libraries unless a specific advanced feature is required.
*   **State Management:** For client-side state, rely on React's built-in hooks (`useState`, `useEffect`, `useContext`). Avoid external state management libraries unless the application complexity explicitly demands it.
*   **Routing:** Next.js's file-system based routing (`app/` directory) should be used for all navigation.