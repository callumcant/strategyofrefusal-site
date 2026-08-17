import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// One markdown file per record, in src/content/<collection>/.
// The filename is the id: series/s-02.md is served at /series/s-02.
//
// Frontmatter (above the ---) holds the fields. The body (below it) holds the
// record's lead prose: a series' standfirst, a book's description. Leave the
// body empty and the page falls back to the short frontmatter summary.
//
// Photographs are referenced by a path relative to the markdown file and
// resolved by image(), which is what hands them to Astro's optimiser.

const relatedRef = z.object({
  ref: z.string(),
  href: z.string().optional(),
});

const series = defineCollection({
  loader: glob({ base: "./src/content/series", pattern: "**/*.md" }),
  schema: ({ image }) =>
    z.object({
      ref: z.string(),
      title: z.string(),
      place: z.string(),
      employer: z.string(),
      union: z.string(),
      dispute: z.string(),
      dateLabel: z.string(),
      frames: z.number(),
      indexDescription: z.string(),
      // Optional: a series without it still builds a page, from the fields
      // above. The standfirst is the markdown body, not a field here.
      detail: z
        .object({
          record: z.object({
            place: z.string(),
            dates: z.string(),
            employer: z.string(),
            union: z.string(),
            dispute: z.string(),
            framesNote: z.string(),
            related: z.array(relatedRef).default([]),
          }),
          note: z.string(),
          // location and date are optional on every shape: a sequence shot in
          // one place on one morning states them on the first plate only.
          plates: z.array(
            z.discriminatedUnion("kind", [
              z.object({
                kind: z.literal("full"),
                ref: z.string(),
                image: image(),
                alt: z.string(),
                height: z.number(),
                objectPosition: z.string().optional(),
                location: z.string().optional(),
                date: z.string().optional(),
                time: z.string().optional(),
                caption: z.string().optional(),
                // A full-bleed frame can carry a passage too, set below it.
                passage: z.string().optional(),
              }),
              z.object({
                kind: z.literal("paired"),
                ref: z.string(),
                image: image(),
                alt: z.string(),
                location: z.string().optional(),
                date: z.string().optional(),
                caption: z.string().optional(),
                passage: z.string(),
              }),
              z.object({
                kind: z.literal("small"),
                ref: z.string(),
                image: image(),
                alt: z.string(),
                objectPosition: z.string().optional(),
                location: z.string().optional(),
                date: z.string().optional(),
                caption: z.string().optional(),
                // Set below the image, spanning the full content width.
                passage: z.string().optional(),
              }),
              // For frames taller than they are wide. The other three shapes
              // are landscape boxes and would crop a portrait to a letterbox.
              z.object({
                kind: z.literal("portrait"),
                ref: z.string(),
                image: image(),
                alt: z.string(),
                objectPosition: z.string().optional(),
                location: z.string().optional(),
                date: z.string().optional(),
                caption: z.string().optional(),
                // Which side the image sits on. Defaults to left.
                align: z.enum(["left", "right"]).default("left"),
              }),
              // Two frames set side by side, read as one plate. The way to
              // pair portraits: mirroring a single portrait across two plates
              // does not read as a pair.
              z.object({
                kind: z.literal("diptych"),
                ref: z.string(),
                images: z
                  .array(
                    z.object({
                      image: image(),
                      alt: z.string(),
                      objectPosition: z.string().optional(),
                    }),
                  )
                  .length(2),
                location: z.string().optional(),
                date: z.string().optional(),
                caption: z.string().optional(),
                passage: z.string().optional(),
              }),
            ]),
          ),
        })
        .optional(),
    }),
});

const books = defineCollection({
  loader: glob({ base: "./src/content/books", pattern: "**/*.md" }),
  schema: z.object({
    ref: z.string(),
    year: z.string(),
    title: z.string(),
    summary: z.string(), // short row description, used on the home page
    // The longer description shown on the books page is the markdown body.
    factsLine: z.string(), // e.g. "Verso · 288pp · £14.99" — used on the home page
    facts: z.array(z.string()), // multi-line mono block used on the books page
    action: z.string(), // "ORDER" | "DOWNLOAD PDF"
  }),
});

const journal = defineCollection({
  loader: glob({ base: "./src/content/journal", pattern: "**/*.md" }),
  schema: z.object({
    ref: z.string(),
    year: z.string(),
    title: z.string(),
    description: z.string(),
    factsLine: z.string(),
  }),
});

// Podcast episodes. Same shape as journal, and rendered with the same row.
// Refs are EP-nn; S-02 already cross-references EP-64.
const audio = defineCollection({
  loader: glob({ base: "./src/content/audio", pattern: "**/*.md" }),
  schema: z.object({
    ref: z.string(),
    year: z.string(),
    title: z.string(),
    description: z.string(),
    factsLine: z.string(), // e.g. "48 MIN · RECORDED AT THE GATE"
  }),
});

const writing = defineCollection({
  loader: glob({ base: "./src/content/writing", pattern: "**/*.md" }),
  schema: z.object({
    ref: z.string(),
    year: z.string(),
    title: z.string(),
    form: z.string(),
  }),
});

// The single photograph that heads each of the three shell pages.
// Ids: home, series-index, books.
const frames = defineCollection({
  loader: glob({ base: "./src/content/frames", pattern: "**/*.md" }),
  schema: ({ image }) =>
    z.object({
      ref: z.string(),
      image: image(),
      alt: z.string(),
      height: z.number(),
      objectPosition: z.string().optional(),
      location: z.string(),
      date: z.string(),
      extra: z.string().optional(),
      caption: z.string(),
      captionAccentRef: z.string().optional(),
    }),
});

export const collections = { series, books, journal, audio, writing, frames };
