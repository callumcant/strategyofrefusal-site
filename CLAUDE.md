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

He works by looking at the page and reacting, so **get something on screen
early and expect to revise it**. When he asks for a change that would silently
lose text he wrote, make the change he asked for and say plainly what went, so
he can put it back — don't quietly reinterpret the instruction to preserve it.

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
Astro content collections: `series`, `books`, `journal`, `audio`, `writing` and
`frames`.
Adding a record means adding a file. The filename is the id, so
`series/s-02.md` is served at `/series/s-02` — there is no separate slug field.

Every collection has a schema in `src/content.config.ts` declaring its fields.
A record that doesn't match fails the build with the file, the field and the
reason. Adding a field means adding it to the schema first.

**The markdown body is the record's lead prose** — a series' standfirst, a
book's description. Both are rendered with `render(entry)` and passed into the
component as a slot, so they take paragraphs and markdown formatting. A series
with an empty body falls back to its one-line `indexDescription`, which is what
`S-01`, `S-03` and `S-04` currently do.

Things that will catch you out:

1. **Three counts are still stated by hand, on purpose.** `src/data/archive.ts`
   holds `journalTotal = 11`, `writingTotal = 10` and `scopeRecordTotal = 61`.
   The archive is bigger than what is published, so these cannot be counted from
   the files — the home page lists a selection but states the true size. They
   are the numbers that go stale. Everything countable (series and books counts,
   the frame total) is derived at build time. **Delete each one the moment its
   collection holds every real record** and count the files instead.
2. **Order is derived from `ref`, not from file order.** Series sort ascending
   (S-01 first); books, journal and writing sort descending (newest first). A
   record's position comes from its `ref`, so refs must stay well-formed and
   zero-padded.
3. **`detail` on a series is optional.** `S-02` and `S-05` have one. `[slug].astro`
   builds a page either way: with `detail` it renders the standfirst, record
   block and plates; without, it falls back to `indexDescription` and a "still
   being catalogued" note. So a new series is one file and it gets a working
   page immediately — fill in `detail` later.
4. **Plates are a tagged union.** `kind: "full" | "paired" | "small" |
   "portrait" | "diptych"`, expressed as a Zod `discriminatedUnion` in the
   schema, and `Plate.astro` dispatches on `kind` to the five `Plate*`
   components. Adding a shape means a new branch in the schema, a new component
   and a new branch in the dispatcher. Notes on the shapes:
   - `full` is full-bleed and takes a `height`.
   - `paired` is a 300px image with the passage beside it. `passage` required.
   - `small` is a 520px inset with the caption beside it, not underneath.
   - `portrait` is for a single frame taller than it is wide. The landscape
     shapes would crop it to a letterbox. It takes `align: left | right`
     (default left) to put the image on either side. `S-06` uses it twice,
     left then right, four plates apart. Mirroring two portraits across
     *consecutive* plates was tried and rejected, because they read as two
     plates rather than as a pair; spaced apart it reads as variation.
     **It lays out as three columns on one row** — frame, meta and caption,
     then passage — reversed for `align: right`. Stacking the passage under
     the meta was tried and rejected: the prose ran on underneath the date
     and time. Because the frame is placed in an explicit grid column, every
     one of the three carries an explicit `grid-row: 1`; without it, grid
     auto-placement (which only ever moves forward) drops the meta and the
     passage onto rows below a right-aligned frame.
   - `diptych` takes exactly two images and sets them side by side as one
     plate, with one reference covering both (`06–07 / 10`). This is the way
     to pair frames. The pair is capped at 380px each rather than stretched
     across the column, so portraits stay portrait instead of cropping square.
   - **`caption`, `location`, `date` and `time` are optional on every shape.** A
     sequence shot in one place on one morning states location and date on the
     first plate and leaves the rest blank; the meta block renders whichever of
     location, date and time are present, and a plate with neither caption nor
     passage renders as the photograph and its reference alone.
   - **Every shape takes a `passage`** — required on `paired`, optional on the
     other four — set in the same serif below the frame, except on `portrait`,
     where it runs *beside* the frame under the caption, in the text column.
     A 340px image left a hole beside it otherwise. The distinction
     between the shapes is the size and arrangement of the image, not whether
     prose is allowed: `caption` is the short note in sans, `passage` is the
     long-form prose in serif, and a plate can have either, both or neither.
   - **A passage can run to several paragraphs.** Passages are written in
     YAML's folded style (`>-`), where a blank line survives as a newline;
     `src/data/passage.ts` splits on those and each component renders one `<p>`
     per paragraph. Do not write a passage in literal style (`|`) — every line
     would become its own paragraph.
5. **Photographs must have their metadata stripped before they enter the repo.**
   This is a safety requirement. These are photographs of workers in live
   disputes, and a straight-from-camera JPEG carries around fifty tags: GPS
   where present, capture times to the second, and the camera **body serial
   number**, which ties every photograph ever published to one camera and so to
   Callum. **Run `npm run photos` on any new batch before committing** — it
   strips everything and downscales to 2560px, and every line of its output
   must say `clean`. It is safe to re-run and skips files already done.
   **Never add a step that preserves or restores metadata**, and don't propose
   reading capture dates out of the files to save typing: the dates are typed
   by hand on purpose. The ten S-05 frames arrived with 54 tags each.
6. **Photographs are referenced by relative path from the markdown file** —
   `image: ../../assets/photographs/4-DSCF8458.jpg` — and resolved by the
   schema's `image()` helper. That is what lets Astro optimise them; the build
   converts the JPEGs to WebP at roughly two thirds the file size. A photograph
   dropped into `public/` would be served exactly as-is, at full weight, which
   is why none are there. They live in one shared folder rather than beside the
   markdown because several records reuse the same frame.
7. **The types in `src/data/schema.ts` are derived from the schemas**, not
   written by hand. Components import `SeriesEntry`, `Plate`, `BookEntry` and so
   on from there. Change `content.config.ts` and the types follow.

## Adding a series

This is the live work: twelve more series to go. `S-05` is the worked
example — read `src/content/series/s-05.md` before starting a new one.
`INVENTORY.md` tracks what has landed.

**Build the page before the words exist.** Every field except `note` is
optional inside `detail`, so the way this actually goes is: photographs in,
alt text written from the frames, shapes chosen, page on screen. Callum then
sends the captions, locations, dates and times back as one block keyed by
filename, and they get typed in. Don't wait on his prose to put something up.

1. **Photographs first.** They go in `src/assets/photographs/` named
   `s06-01.jpg` upward, in the order Callum gives them. **Run `npm run photos`
   and check every line says `clean` before anything is committed.**
2. **Write the alt text by looking at the photographs.** Read the image files;
   don't paraphrase the caption. The alt describes the frame, the caption says
   what is happening.
3. **`ref` is positional, not the frame's identity** — `03 / 10` means the
   third plate of ten shown, so the numbers stay ascending down the page even
   when the sequence is reordered. `S-02` follows the same convention with four
   plates selected from forty-one. A diptych takes both numbers: `06–07 / 10`.
4. **A single-day sequence states `location` and `date` on plate 01 only.**
   Repeating them down the page is noise. A series shot across several days
   restates them on the first plate of each — `S-01` does this three times,
   on plates 01, 10 and 12, one per strike.
5. **Expect several rounds on the shapes.** Callum reads the page and comes
   back with "02 should be small", "swap 03 and 04", "delete all captions". The
   shapes are cheap to change — it is one field — so build it, let him look,
   change it. Don't try to get the rhythm right first time.
6. **Say which words are yours.** Alt text, any caption you drafted, any
   location or date you inferred. He needs to know what to check.
7. **Update `INVENTORY.md` in the same commit.**

Things only Callum can supply, so ask rather than invent: the standfirst, the
one-line `indexDescription`, the record `note` (his `S-02` draft used it for a
consent line, which matters when a plate shows an identifiable worker), and
anything naming a person or an employer.

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
npm run build    # → dist/ ; currently 9 pages
npm run preview  # serve the built dist/ as Netlify will
npm run photos   # strip metadata + downscale new photographs
```

**There is no browser driver installed.** For a screenshot — worth taking when
a layout question is easier to see than to reason about — headless Chrome
works without one:

```bash
chrome --headless=new --hide-scrollbars --virtual-time-budget=12000 \
  --window-size=1400,7000 --screenshot=out.png http://localhost:4321/series/s-05
```

Crop it with `sharp` (already a dependency, via Astro) to look at one plate
closely. Run any such script from the repo root so `sharp` resolves.

**If the page in the browser disagrees with the code, restart the dev server
before believing the browser.** Rewriting a component's whole `<style>` block
can leave `astro dev` serving the previous scoped CSS: the HTML and the
stylesheet in the served page both look correct, but the browser renders the
old layout. `npm run build` is unaffected and is the honest check. This has
already cost one long debugging session — the layout was right the entire time.

```bash
astro dev stop && astro dev --background
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

- **Three of the six nav items go nowhere.** `TopBar.astro` lists Journal,
  Writing and Index with no `href`, so they render as dead text. Journal and
  Writing have collections but no page; Index has neither.
- **Most of the content is still placeholder.** `S-01`, `S-05` and `S-06` are
  real. `S-02` to `S-04` are sample data and are due to be replaced, as are the
  books, journal and writing records; `audio` is empty.
  `INVENTORY.md` in the repo root tracks what is real and what is still
  sample data — keep it current, it is what survives between sessions.
- **`getCollection("audio")` warns on every build** while the collection is
  empty ("does not exist or is empty"). The build still succeeds and the page
  renders a "still being catalogued" line. The warning goes when the first
  episode lands.
- `tokens.css` cites `design_handoff_strategy_of_refusal/README.md` as the
  source of the design. That folder is not in the repo.
- **Plate captions, the record note and the journal descriptions are still
  frontmatter**, because each is a fragment composed with other text rather than
  a standalone paragraph — the home page's featured caption, for instance, runs
  straight into an accented series reference. Only the lead prose moved to the
  body.
- **The series index headline is now wrong.** `series/index.astro` hardcodes
  `["Four", "disputes,"]` and there are five series since `S-05` landed, so the
  page reads "Four disputes" above a list of five. The books page has the same
  hardcoded `["Three", "books"]`. Nothing computes either. This needs a
  number-to-word helper before the next series is added, or it will be wrong
  again immediately.
- The masthead scope line lists "PHOTOGRAPHS, BOOKS, JOURNAL, WRITING" and does
  not mention audio, now that audio exists. Callum's copy to change.
- No custom domain, no analytics, no sitemap or RSS.
