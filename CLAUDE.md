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
  content/        the archive itself — one markdown file per record
  content.config.ts   the schemas; the shape every record must match
  data/           archive.ts (stated totals) and schema.ts (derived types)
  assets/         photographs/ — referenced from frontmatter, not served raw
  styles/         tokens.css — the only global stylesheet
public/           favicons; files here are copied through untouched
```

## The data model

**The archive lives in `src/content/` as markdown files, one per record**, in
Astro content collections: `series`, `books`, `journal`, `writing` and `frames`.
Adding a record means adding a file. The filename is the id, so
`series/s-02.md` is served at `/series/s-02` — there is no separate slug field.

Every collection has a schema in `src/content.config.ts` declaring its fields.
A record that doesn't match fails the build with the file, the field and the
reason. Adding a field means adding it to the schema first.

Things that will catch you out:

1. **Two counts are still stated by hand, on purpose.** `src/data/archive.ts`
   holds `journalTotal = 7`, `writingTotal = 11` and `scopeRecordTotal = 68`.
   The archive is bigger than what is published, so these cannot be counted from
   the files — the home page lists a selection but states the true size. They
   are the numbers that go stale. Everything countable (series and books counts,
   the frame total) is derived at build time.
2. **Order is derived from `ref`, not from file order.** Series sort ascending
   (S-01 first); books, journal and writing sort descending (newest first). A
   record's position comes from its `ref`, so refs must stay well-formed and
   zero-padded.
3. **`detail` on a series is optional.** Only `S-02` has one. `[slug].astro`
   builds a page either way: with `detail` it renders the standfirst, record
   block and plates; without, it falls back to `indexDescription` and a "still
   being catalogued" note. So a new series is one file and it gets a working
   page immediately — fill in `detail` later.
4. **Plates are a tagged union.** `kind: "full" | "paired" | "small"`, expressed
   as a Zod `discriminatedUnion` in the schema, and `Plate.astro` dispatches on
   `kind` to `PlateFull` / `PlatePaired` / `PlateSmall`. Adding a plate shape
   means a new branch in the schema, a new component and a new branch in the
   dispatcher.
5. **Photographs are referenced by relative path from the markdown file** —
   `image: ../../assets/photographs/4-DSCF8458.jpg` — and resolved by the
   schema's `image()` helper. That is what lets Astro optimise them; the build
   converts the four JPEGs to WebP at roughly half the file size. A photograph
   dropped into `public/` would be served exactly as-is, at full weight, which
   is why none are there. They live in one shared folder rather than beside the
   markdown because several records reuse the same frame.
6. **The types in `src/data/schema.ts` are derived from the schemas**, not
   written by hand. Components import `SeriesEntry`, `Plate`, `BookEntry` and so
   on from there. Change `content.config.ts` and the types follow.

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
  and Writing already have collections waiting; Audio and Index have nothing.
- **The content is placeholder.** Four photographs, one series with plates,
  sample records in every collection.
- `tokens.css` cites `design_handoff_strategy_of_refusal/README.md` as the
  source of the design. That folder is not in the repo.
- **The markdown bodies are empty.** Records are entirely frontmatter, so prose
  like `standfirst` and the plate captions are still YAML fields. Moving the
  lead paragraph into the body is the natural next step and would change the
  rendered markup, which is why it wasn't done in the same pass as the
  migration.
- The series index and books page still hardcode their headline word count —
  `["Four", "disputes,"]` and `["Three", "books"]`. Nothing computes them.
- The site footer credits "Ellen Hartnoll, union organiser" and
  `hello@strategyofrefusal.com`. Unconfirmed whether that's the intended byline
  or placeholder — ask before treating it as either.
- No custom domain, no analytics, no sitemap or RSS.
