export type GlossaryEntry =
  | { preserve: true } // Keep English as-is
  | { translation: string }; // Use fixed Chinese translation

// Longer keys first — post-processing replaces in this order to avoid
// short keys (e.g. "React") consuming part of a longer match (e.g. "React Native").
export const glossary: Record<string, GlossaryEntry> = {
  // Fixed translations — proper nouns with established Chinese names
  "Seclusion of Sage": { translation: "棲仙" },

  // Preserve as English — tech brands / framework names
  "Tailwind CSS": { preserve: true },
  "Sanity CMS": { preserve: true },
  "Next.js": { preserve: true },
  React: { preserve: true },
  TypeScript: { preserve: true },
  GitHub: { preserve: true },
  Vercel: { preserve: true },
  Swiper: { preserve: true },
  ReFocus: { preserve: true },
};
