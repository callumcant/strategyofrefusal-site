# Strategy of Refusal

A static archive site — photographs, books, journal issues and writing, all
organised around class struggle in Britain. Each dispute is a *photo sequence*
with a reference (`S-01`), a record block (place, employer, union, dispute) and
a set of photographic *plates*.

**The reader sees "photo sequences"; the code says `series`.** Renamed in the
visible copy in August 2026, and only there — the collection, the route
(`/series/s-03`), the `S-nn` refs, the content folder and every `Series*`
component keep the old name. The nav item reads **"Photo"**. Don't rename the
internals to match without being asked: the URLs were deliberately left alone.

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
Three collections have a page per record — `series`, `audio` and `journal`;
the rest are listed on an index only.

Every collection has a schema in `src/content.config.ts` declaring its fields.
A record that doesn't match fails the build with the file, the field and the
reason. Adding a field means adding it to the schema first.

**The markdown body is the record's lead prose** — a series' standfirst, a
book's description. Both are rendered with `render(entry)` and passed into the
component as a slot, so they take paragraphs and markdown formatting. A series
with an empty body falls back to its one-line `indexDescription`, which is what
`S-01` currently does — it has all 17 plates and no standfirst.

Things that will catch you out:

1. **One count is still stated by hand, on purpose.** `src/data/archive.ts`
   holds `scopeRecordTotal = 70`, the sum of the five collection targets. Only
   the series are still short of theirs, so this is the last number that cannot
   be counted from the files, and the last one that goes stale. Everything else
   (the series, books, audio, journal and writing counts, the frame total) is
   derived at build time. **Delete it the moment every collection holds its real
   records** and count the files instead — that is what happened to
   `journalTotal` when issues 17–27 landed, and to `writingTotal` when the
   nineteen articles did.
2. **Order is derived from `ref`, not from file order.** Series sort ascending
   (S-01 first); books, journal and writing sort descending (newest first). A
   record's position comes from its `ref`, so refs must stay well-formed and
   zero-padded.
3. **`detail` on a series is optional**, though all three that exist now have
   one. `[slug].astro` builds a page either way: with `detail` it renders the
   standfirst, record block and plates; without, it falls back to
   `indexDescription` and a "still being catalogued" note. So a new series is
   one file and it gets a working page immediately — fill in `detail` later.
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
     (default left) to put the image on either side. `S-02` uses it twice,
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
   by hand on purpose. The ten S-03 frames arrived with 54 tags each.
6. **Photographs are referenced by relative path from the markdown file** —
   `image: ../../assets/photographs/4-DSCF8458.jpg` — and resolved by the
   schema's `image()` helper. That is what lets Astro optimise them; the build
   converts the JPEGs to WebP at roughly two thirds the file size. A photograph
   dropped into `public/` would be served exactly as-is, at full weight, which
   is why none are there. They live in one shared folder rather than beside the
   markdown because several records reuse the same frame.
7. **The types in `src/data/schema.ts` are derived from the schemas**, not
   written by hand. Components import `SeriesEntry`, `Plate`, `BookEntry`,
   `AudioData` and so on from there. Change `content.config.ts` and the types
   follow.
8. **`audio` is every episode of one podcast**, Workers' Inquiry by Notes from
   Below, so the show's name and URL live in `src/data/archive.ts` as
   `PODCAST_NAME` and `PODCAST_URL` rather than in 22 frontmatter blocks.
   `PODCAST_NAME` is the show alone — the publisher is `JOURNAL_NAME`, and the
   record page's PODCAST field joins the two, because the audio index needs to
   link each to a different place. Each
   record carries `dateLabel`, `duration`, optional `voices` and `listenUrl`, and
   a `reading` list of `{ label, href }`. **There is no `factsLine`** — the index
   row's facts column is derived from `duration`, so it cannot go stale. As with
   a series, the markdown body is the lead prose and an empty body falls back to
   the one-line `description`. See INVENTORY.md for how the refs were assigned;
   the podcast's own numbering is unreliable and the last five are inferred.
9. **`journal` is issues 17–27 of one journal**, Notes from Below, and follows
   audio's shape exactly: `JOURNAL_NAME` and `JOURNAL_URL` in
   `src/data/archive.ts` rather than in 11 frontmatter blocks, no `factsLine`
   (the index row's facts column is derived from the length of `contents`), and
   the markdown body as the lead prose. Two things differ from audio.
   **The ref carries the publisher's own printed number** — `J-17` is issue 17,
   so the run starts at 17 and there is no `J-01`; `issueNumber` restates it as
   a number so the refs could be renumbered without losing it. And **the body
   prose is Notes from Below's own editorial, quoted verbatim**, not written
   here — the only invented text in the collection is the one-line
   `description` on each record. `contents` is the issue's table of contents
   (`title`, `authors`, `href`), `downloads` is the whole issue as a file where
   they offer one, and its `format` field doubles as the field label.
10. **`books` is Callum's three books**, scraped from Polity, Canongate and
    Verso. Same bargain again: the body is the publisher's blurb verbatim and
    the one-line `summary` is the only invented text. **`authors` is required**
    because two of the three are co-authored — assume nothing about the byline.
    `subtitle` and `href` are optional; `href` turns the `action` label into a
    link, and leaving it off renders the action as plain text, which is what an
    out-of-print book wants. See INVENTORY.md for how each publisher's page had
    to be read — Polity's is a JavaScript app with a WordPress API behind it.
11. **`writing` is Callum's nineteen published articles** — sixteen pieces of
    journalism and three peer-reviewed research articles — each one hosted by
    whoever published it. So **`href` is required**, unlike on books, and the
    index links every title straight out; there are no record pages. `authors`
    is required for the same reason as on books: five of the nineteen are
    co-authored, one of them by five people. `description` is the outlet's own
    standfirst — the opening sentence of the abstract on the three research
    articles — **trimmed of every mention of Callum**, because the third person
    reads oddly in an archive of his own writing. So the substance is the
    publisher's and the cuts are ours; INVENTORY.md names the three lines where
    the cut needed rewording. The markdown body is the full abstract, which is
    why only those three have one. The bodies are not rendered anywhere yet — the index shows the
    one-liner — so showing them is a change to `writing/index.astro` and
    nothing else. The facts column is derived from `publication`, `citation`
    and `dateLabel`, so it cannot go stale, and `citation` and `doi` are
    optional because only the research articles carry them.

## Adding a series

This is the live work: eleven more series to go. `S-03` is the worked
example — read `src/content/series/s-03.md` before starting a new one.
`INVENTORY.md` tracks what has landed.

**Build the page before the words exist.** Every field except `note` is
optional inside `detail`, so the way this actually goes is: photographs in,
alt text written from the frames, shapes chosen, page on screen. Callum then
sends the captions, locations, dates and times back as one block keyed by
filename, and they get typed in. Don't wait on his prose to put something up.

1. **Photographs first.** They go in `src/assets/photographs/` named for their
   sequence and numbered from one — `s04-01.jpg` upward for `S-04` — in the
   order Callum gives them. **Run `npm run photos`
   and check every line says `clean` before anything is committed.**
2. **Write the alt text by looking at the photographs.** Read the image files;
   don't paraphrase the caption. The alt describes the frame, the caption says
   what is happening.
3. **`ref` is positional, not the frame's identity** — `03 / 10` means the
   third plate of ten shown, so the numbers stay ascending down the page even
   when the sequence is reordered, and a sequence may show a selection from a
   much larger shoot. A diptych takes both numbers: `06–07 / 10`.
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
one-line `indexDescription`, the record `note` (an early draft used it for a
consent line, which matters when a plate shows an identifiable worker), and
anything naming a person or an employer.

## Design rules

- **Tokens in `src/styles/tokens.css` are the whole palette.** Cream on a blue
  ground for the shell, ink on paper for the record pages. Don't introduce a
  new colour; add a token if something genuinely new is needed.
- **The type sits in a centred column, the grounds and the photographs do not.**
  `--page-max: 1240px` in `tokens.css` is the one number; added August 2026,
  because on a wide monitor every row stretched to the viewport and left a lane
  of empty blue between the description and the date. `ShellFrame` and the three
  record-page wrappers (`.series-page`, `.episode-page`, `.issue-page`) are
  three-column grids — `1fr min(var(--page-max), 100%) 1fr` — where children land
  in the middle column by default and anything full-bleed opts out with
  `grid-column: 1 / -1`. Only two things opt out: `.photo-record` on the index
  pages and `.plate-full` on a series page. Two traps. **Slotted children carry
  the *page's* scope id, not the wrapper's**, so the child selector has to be
  `.wrapper > :global(*)` or it silently matches nothing. And **a full-bleed
  image's caption still has to line up with the column**, which is why
  `.photo-record__caption`, `.plate-full__caption` and `.plate-full__passage-row`
  each carry `max-width: var(--page-max); margin-inline: auto` — without it the
  plate reference sits against the viewport edge while every other reference on
  the page starts 330px in. `min()` makes the whole thing a no-op below 1240px,
  so the mobile breakpoints are untouched.
- **A full-bleed photograph's `height` is its height at a 1400px window, not a
  fixed height.** `PlateFull` (the `full` plate shape) and `PhotoRecord` (the
  featured band on the index pages) both size the frame with
  `aspect-ratio: 1400 / var(--plate-h)` and a `min-height` of the stated
  number, so below 1400px nothing has changed and above it the frame grows
  taller in proportion. It used to be a fixed pixel height with
  `object-fit: cover`, which meant a wide monitor got a wider, flatter box and
  `cover` cropped the frame into a letterbox slice — a `530` plate went from
  2.6:1 to 4.8:1 across the range. Two traps if this is ever touched.
  **The custom property is unitless** (`--plate-h:530`, turned back into a
  length with `calc(var(--plate-h) * 1px)`), because CSS cannot divide one
  length by another, so `100vw / 1400px` is not expressible and `aspect-ratio`
  with two plain numbers is what gets the same result. And **`height: auto` is
  load-bearing**: Astro's `<Image>` writes `width` and `height` attributes onto
  the `<img>`, and a specified height makes the browser ignore `aspect-ratio`
  entirely — leave it out and every plate renders at the source file's own
  height at every window width. A `max-height: 90vh` stops an ultrawide getting
  a plate taller than the screen.
- **No rounded corners and no shadows, anywhere.** This is enforced globally
  with `border-radius: 0 !important` and `box-shadow: none !important` on `*`.
  Any component that appears to need either is fighting the design, not the CSS.
- **Component styles are scoped.** A `<style>` block inside an `.astro` file
  applies only to that component — Astro rewrites the selectors. Only
  `tokens.css` is global.
- `TopBar` has two variants, `shell` (cream on blue, home page) and `quiet`
  (ink on paper, record pages), **with different nav lists** — `quiet` drops
  "Writing". Changing the navigation means changing both arrays. Each item's
  `key` matches the collection and the route, and is what `active` highlights,
  so **the key and the label are allowed to differ**: `{ key: "series", label:
  "Photo" }` is deliberate, not a mistake to tidy up.
- **The home page shows three of everything.** `homeShown` in
  `src/pages/index.astro` is one number that slices all five sections, and the
  count beside each heading is the collection's true length, counted from the
  files. Letting each section run to its own length made them read as unequal
  in importance rather than as different sizes of collection.
- **Every index page has the same three-part shape**: a blue heading block, the
  archive rows on a cream block, and a featured photograph at the foot. The
  cream block is `ArchiveBlock.astro` (or `IndexTable.astro`, which is the same
  thing with a column header attached, used by the sequences). **The rows have
  to be told which ground they are on** — `PublicationRow` and `BookRow` both
  take `tone="shell"` (cream on blue, the home page) or `tone="paper"` (ink on
  cream, the index pages). Forget the prop and the row renders cream on cream,
  which is invisible rather than broken, so it will not fail the build.
- **The whole archive is published under `CC BY-NC-ND 4.0`.** The name, the URL
  and the plain-language summary are `LICENCE_NAME`, `LICENCE_URL` and
  `LICENCE_SUMMARY` in `src/data/archive.ts` — stated once so the footer mark
  and the About page cannot drift apart. This replaced the "FREE TO UNIONS AND
  CAMPAIGNS" footer line in August 2026. Note what ND means in practice: a
  campaign may reproduce a photograph whole and credited, but may not crop it,
  overlay text on it or edit it.
- Fonts (Archivo, Source Serif 4, IBM Plex Mono) load from Google Fonts in
  `BaseLayout.astro`. That is the site's only external dependency at runtime.
- **The condensed headlines use `font-variation-settings: "wdth" N`, never
  `font-stretch: N%`.** This is not a style preference and must not be tidied
  back. Astro's CSS minifier folds a trailing `font-stretch` percentage into the
  preceding `font` shorthand — `font: 800 62% 30px/1 Archivo` — and a percentage
  is not legal there, so the browser discards the *whole* declaration and the
  heading falls back to body type at body size. **It only happens in a production
  build**, because `astro dev` does not minify, so the dev server will look
  correct while the deployed site is wrong. This shipped to Netlify for some time
  before anyone spotted it, and was found by comparing a wide screenshot against
  an old wireframe. `DisplayHeading` was the only one unaffected, because the
  `var()`s in its shorthand stop the minifier folding it — which is why the
  masthead alone looked right. Archivo's `wdth` axis is 62–125 and is already
  requested in the Google Fonts URL, so the two spellings render identically.
  Guard it after any build with:
  `grep -o 'font:[^;}]*%' dist/_astro/*.css dist/*.html` — that must find nothing.

## Running and building

Node 24 LTS. There is no test suite; verification is running the site and
looking at it.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # → dist/ ; currently 44 pages
npm run preview  # serve the built dist/ as Netlify will
npm run photos   # strip metadata + downscale new photographs
```

**There is no browser driver installed.** For a screenshot — worth taking when
a layout question is easier to see than to reason about — headless Chrome
works without one:

```bash
chrome --headless=new --hide-scrollbars --virtual-time-budget=12000 \
  --window-size=1400,7000 --screenshot=out.png http://localhost:4321/series/s-03
```

Crop it with `sharp` (already a dependency, via Astro) to look at one plate
closely. Run any such script from the repo root so `sharp` resolves.

**If the page in the browser disagrees with the code, restart the dev server
before believing the browser.** Rewriting a component's whole `<style>` block
can leave `astro dev` serving the previous scoped CSS: the HTML and the
stylesheet in the served page both look correct, but the browser renders the
old layout. `npm run build` is unaffected and is the honest check. This has
already cost one long debugging session — the layout was right the entire time.

**The same staleness hides records, and that is harder to spot.** `astro dev`
validates the collections against `content.config.ts` when it starts and caches
the result, so **editing the schema and the records together makes every record
that depends on the change vanish** — the running server checks the new
frontmatter against the old schema, fails it, and drops it from the collection.
There is no error in the log: the index is just short and the record's route
404s. This is what happened when `downloads` changed from `label` to `format`
and J-26 and J-27 disappeared while J-17 to J-25 stayed. **Restart the dev
server after any change to `content.config.ts`**, and check the record count on
the index rather than trusting that a page you did not open still works.

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

- **Every nav item now goes somewhere.** Index was replaced by About in August
  2026, and `/about` exists. `ShellSectionHead` still takes an optional `href`
  for a section with no index page, but nothing uses the plain-text form today.
- **The About page is three fields: bio, email, licence.** The bio is Callum's
  own paragraph, supplied verbatim in August 2026 and held as a string in
  `about.astro` — **his words, so do not edit them**, including the publisher
  names inside it. The archive totals, the start year and the list of books
  were all on this page and were all cut: the counts belong on the pages
  holding the records, and the books are named in the bio and listed on
  `/books`. It also carries a featured photograph at the foot, added August
  2026 — the same `PhotoRecord` the index pages use, fed by `frames/about.md`
  (S-01.13, Callum's choice), which makes About the seventh page with a frame.
- **Nothing in `src/content/` is sample data any more.** The three placeholder
  sequences were deleted in August 2026 and every `frames` record now points at
  a real plate from `S-01`, `S-02` or `S-03`, with the plate's own caption.
  `INVENTORY.md` tracks what has landed — keep it current, it is what survives
  between sessions.
- **The three real sequences were renumbered in August 2026**, on Callum's
  instruction, after the placeholders holding those refs were deleted: The
  Death of a University went from `S-06` to `S-02`, Too Hot to Work from `S-05`
  to `S-03`. Chasing the Wildcat kept `S-01`. **The photographs were renamed to
  match** — `s06-*.jpg` to `s02-*.jpg`, `s05-*.jpg` to `s03-*.jpg` — so the
  filename prefix still names the sequence a frame belongs to. The next new
  sequence is `S-05`. Anything written before that date referring to `S-05` or
  `S-06` means these two.
- **Four sample photographs are now unreferenced**: `1-DSCF6025.jpg`,
  `2-DSCF2894.jpg`, `3-DSCF2021.jpg` and `4-DSCF8458.jpg` in
  `src/assets/photographs/`. Nothing imports them, so the build ignores them
  and they cost only repo weight. Left in place rather than deleted, because
  deleting a photograph is Callum's call.
- `tokens.css` cites `design_handoff_strategy_of_refusal/README.md` as the
  source of the design. That folder is not in the repo.
- **Plate captions, the record note and the journal descriptions are still
  frontmatter**, because each is a fragment composed with other text rather than
  a standalone paragraph — the home page's featured caption, for instance, runs
  straight into an accented series reference. Only the lead prose moved to the
  body.
- ~~The index headlines are hardcoded~~ — fixed. `numberWord()` in
  `src/data/archive.ts` spells a count out ("Three"), which is what the display
  headings need and what `pad()` cannot do. It covers 0–20 and falls back to
  the numeral above that. Only `books/index.astro` still uses it — the Photos
  page's headline became the single word "Photos" in August 2026, on Callum's
  instruction, which took the frame count off that page with it.
- **Every index page's heading and subhead is Callum's copy**, rewritten by him
  in August 2026, and **every one is a fragment with no full stop** — "Images
  as a form of inquiry", "Articles on strikes, platform work and the labour
  movement". That is deliberate; don't tidy them into sentences. They are all
  now plain strings: the writing page's used to assemble its own outlet list
  and date range from the records, and that went with the rewrite, so the
  numbers on that page no longer state themselves.
- **`PhotoRecord` takes an `objectPosition` and every caller must pass it.**
  It says which part of a photograph survives the crop into the band, and a
  page that forgets the prop silently centres the frame instead — which is how
  the home and Photos pages came to be cutting the heads off their pickets
  while the records said otherwise. There is no error: the page just looks
  wrong. Check all six index pages if a featured frame ever looks miscropped.
- **The masthead scope line reads "AN ARCHIVE OF CLASS STRUGGLE IN BRITAIN"**,
  Callum's wording, August 2026. It previously carried a list of the formats —
  "PHOTOGRAPHS, BOOKS, PODCASTS, JOURNAL, WRITING" — which went with the
  rewrite. It is hardcoded in `src/pages/index.astro` and is his copy to change.
- No custom domain, no analytics, no sitemap or RSS.
