# Strategy of Refusal

A static archive site — photographs, books, journal issues and writing, all
organised around British labour disputes. Each dispute is a *series* with a
reference (`S-01`), a record block (place, employer, union, dispute) and a set
of photographic *plates*.

Built with **Astro 7**: components and data files are turned into plain HTML
files at build time, so what deploys is static files with no server behind them.
Deployed on **Netlify** from `https://github.com/callumcant/strategyofrefusal-site`.

See `AGENTS.md` for links into the Astro documentation.

## Working with Callum

Callum is an organiser and writer, not a developer. **Explain jargon in plain
language as you go** — he has asked for this explicitly and wants to learn from
the work. Name the concept, say what it does, move on. Don't pad, and don't skip
the explanation either.

## Layout

```
src/
  pages/          one file per URL — index, books/, series/, series/[slug]
  layouts/        BaseLayout.astro — the <html> shell, fonts, tokens import
  components/     everything else; .astro files with scoped <style> blocks
  data/           the archive itself, as typed TypeScript modules
  assets/         photographs/ — imported, not served raw (see below)
  styles/         tokens.css — the only global stylesheet
public/           favicons; files here are copied through untouched
```

## The data model

**The archive lives in `src/data/*.ts` as plain typed arrays**, not in Astro's
content collections and not in markdown. Adding a record means editing the array
in the relevant file. `series.ts` also exports `findSeries(slug)`.

Things that will catch you out:

1. **The displayed counts are hardcoded, not derived from the arrays.**
   `writing.ts` exports `writingTotal = 11` alongside 3 entries; `journal.ts`
   does the same. This is deliberate — the home page lists a selection but
   states the true size of the archive. So adding a record means updating *two*
   things, and the total is the one that gets forgotten.
2. **`ScopeLine` on the home page hardcodes `68 RECORDS · 2019 —`.** Same
   pattern, but with nothing computing it at all. Grep for it when the archive
   grows.
3. **Section counts are written as `` `0${series.length}` ``** — a literal zero
   glued to the front to get `04`. At ten or more records that renders `010`.
   Fix it with padding when you cross that line.
4. **`detail` on a series is optional.** Only `S-02` has one. `[slug].astro`
   builds a page either way: with `detail` it renders the standfirst, record
   block and plates; without, it falls back to `indexDescription` and a "still
   being catalogued" note. So a new series is one array entry and it gets a
   working page immediately — fill in `detail` later.
5. **Plates are a tagged union.** `kind: "full" | "paired" | "small"`, and
   `Plate.astro` dispatches on `kind` to `PlateFull` / `PlatePaired` /
   `PlateSmall`. Adding a plate shape means a new `kind`, a new component and a
   new branch in the dispatcher.
6. **Photographs must be imported through `src/data/photos.ts`,** which maps a
   short key to an imported `ImageMetadata`. Importing is what lets Astro
   optimise them — the build converts the four JPEGs to WebP at roughly half the
   file size. A photograph dropped into `public/` would be served exactly as-is,
   at full weight, which is why none are there.

## Design rules

- **Tokens in `src/styles/tokens.css` are the whole palette.** Cream on a blue
  ground for the shell, ink on paper for the record pages. Don't introduce a
  new colour; add a token if something genuinely new is needed.
- **No rounded corners and no shadows, anywhere.** This is enforced globally
  with `border-radius: 0 !important` and `box-shadow: none !important` on `*`.
  Any component that appears to need either is fighting the design, not the CSS.
- **Component styles are scoped.** A `<style>` block inside an `.astro` file
  applies only to that component — Astro rewrites the selectors. Only
  `tokens.css` is global.
- `TopBar` has two variants, `shell` (cream on blue, home page) and `quiet`
  (ink on paper, record pages), **with different nav lists** — `quiet` drops
  "Writing". Changing the navigation means changing both arrays.
- Fonts (Archivo, Source Serif 4, IBM Plex Mono) load from Google Fonts in
  `BaseLayout.astro`. That is the site's only external dependency at runtime.

## Running and building

Node 24 LTS. There is no test suite; verification is running the site and
looking at it.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # → dist/ ; currently 7 pages
npm run preview  # serve the built dist/ as Netlify will
```

`npm install` reports that it declined to run esbuild's `postinstall` script —
newer npm blocks packages from executing code at install time unless allowed.
The build works regardless locally. If a Netlify build ever fails where the
local one passes, check this first.

## Deploying

`netlify.toml` in the repo root is the record of the build settings: command
`npm run build`, publish directory `dist`, and `NODE_VERSION = "24"`. Astro 7
refuses to build on Node below 22.12 and Netlify's default can lag, so the pin
is load-bearing. **Change build settings in that file, not in the Netlify web
dashboard** — a value typed into the dashboard is invisible to everyone reading
the repo.

Netlify builds on push to `main`.

## Known gaps

- **Four of the six nav items go nowhere.** `TopBar.astro` lists Journal,
  Writing, Audio and Index with no `href`, so they render as dead text. Journal
  and Writing already have data files waiting; Audio and Index have nothing.
- **The content is placeholder.** Four photographs, one series with plates,
  sample rows in every data file.
- `tokens.css` cites `design_handoff_strategy_of_refusal/README.md` as the
  source of the design. That folder is not in the repo.
- The plate spacing in `[slug].astro` keys off the string `"01 / 04"` to spot
  the first plate. It breaks silently on any series whose plates aren't
  numbered out of four.
- The site footer credits "Ellen Hartnoll, union organiser" and
  `hello@strategyofrefusal.com`. Unconfirmed whether that's the intended byline
  or placeholder — ask before treating it as either.
- No custom domain, no analytics, no sitemap or RSS.
