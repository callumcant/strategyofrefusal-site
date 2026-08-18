# Archive inventory

What the archive should hold, and how much of it has actually landed. This is
the working record for filling the site — **update it in the same commit as the
content**, because it is the only thing that survives between sessions.

Target sizes given by Callum, August 2026.

| Collection | Target | Landed | Real? | Status |
| --- | --- | --- | --- | --- |
| Sequences | 15 | 3 | **all real** | S-01 Chasing the Wildcat: 17 plates, 12 captioned, no standfirst and no passages at all. S-02 The Death of a University: 16 plates covering 17 frames, 8 carrying a caption or a passage, 8 still photograph-and-reference only. S-03 Too Hot to Work: complete — 9 plates covering 10 frames, 6 with passages. The three placeholders were deleted in August 2026 and these three renumbered into the gap |
| Books    | 3  | 3 | **yes** | **Complete.** Riding for Deliveroo, Feeding the Machine, The Future in Our Past — scraped from the three publishers |
| Journal  | 11 | 11 | **yes** | **Complete.** Issues 17–27 of Notes from Below, scraped from their issue pages. Every one has a record page at `/journal/j-nn` |
| Audio    | 22 | 22 | **yes** | **Complete.** All 22 episodes of Workers' Inquiry, catalogued from the podcast's RSS feed. Every one has a record page at `/audio/ep-nn` |
| Writing  | 19 | 19 | **yes** | **Complete.** Nineteen articles, 2018-2024, scraped from Notes from Below, Novara Media, Vice, the Guardian and three academic journals |
| Frames   | 6  | 6 | **yes** | One featured photograph per shell page — home, photos, books, journal, audio, writing. All six are real plates from S-01, S-02 and S-03 |

## The renumbering, August 2026

The three placeholder sequences were deleted, and Callum then renumbered the
three real ones into the gap they left:

| Was | Now | Title |
| --- | --- | --- |
| S-01 | S-01 | Chasing the Wildcat |
| S-06 | **S-02** | The Death of a University |
| S-05 | **S-03** | Too Hot to Work |

**The photographs were renamed with them** — `s06-*.jpg` became `s02-*.jpg` and
`s05-*.jpg` became `s03-*.jpg` — so a filename still names the sequence its
frame belongs to, which is the convention the whole folder runs on. The image
numbering inside each sequence was left exactly as it was, including the places
where it never matched the plate numbers (S-02's plate 09 is `s02-10.jpg`).
**The next new sequence is `S-04`.** Anything written before this date that
mentions S-05 or S-06 means these two.

**There is no sample data left in `src/content/`.** Every `frames` record now
points at a real plate, with its alt text, caption, location and date intact:

| Page | Plate | Caption |
| --- | --- | --- |
| home | S-01.04 | The pickets celebrate |
| photos | S-01.01 | A picket guards the entrance to a dark kitchen |
| books | S-03.01 | Even this early in the morning, the sun is already hot… |
| journal | S-02.02 | An academic confronts the Vice-Chancellor… |
| audio | S-01.02 | News of the strike spreads via short form video |
| writing | S-02.07 | *none — the plate has no caption* |

**Which six were chosen is half Callum's**: he picked S-01.01 for the photos
page and S-02.07 for writing. The other four were picked here and each is one
field to change. The captions are all his.

**The writing frame is the only one with no caption**, because plate 07 of S-02
carries none in the sequence either. `caption` was made optional on the frames
schema rather than invent one; `PhotoRecord` then renders the photograph, its
reference and its meta alone. Its location and date are **inferred** — plate 07
states neither, so it takes them from plate 06, the last plate that does.

Their four original photographs (`1-DSCF6025.jpg`, `2-DSCF2894.jpg`,
`3-DSCF2021.jpg`, `4-DSCF8458.jpg`) are now referenced by nothing. The build
ignores them; they were left in `src/assets/photographs/` rather than deleted.

## Audio

The 22 records are every episode of **Workers' Inquiry**, the Notes from Below
podcast, taken from its RSS feed (`https://anchor.fm/s/fcad7a08/podcast/rss`) in
August 2026. Things to know before adding EP-23:

- **The feed has 24 items; 22 are episodes.** The other two are the 4-minute
  "Ep 0: Introducing Workers' Inquiry" trailer and a "Summer break and listener
  survey" announcement. Both were deliberately left out — they are housekeeping,
  not records. If either is ever wanted, the trailer would be EP-00.
- **Refs are assigned by broadcast order, oldest first**, so EP-01 is January
  2025 and EP-22 is August 2026. The index and the record pages sort them
  newest-first, off the ref.
- **The feed's own numbering cannot be trusted.** Its `itunes:episode` tags
  restart, skip and disagree with the titles; the titles are the reliable
  source. From February 2026 the titles stop carrying "Ep nn" altogether, so
  **EP-18 to EP-22 are numbered by date, which is an inference, not the show's
  own numbering.** If Notes from Below has its own numbers for those five,
  theirs should win.
- **Titles have the "Ep nn:" prefix stripped**, because the ref column already
  carries the number.
- `listenUrl` is the episode's `open.spotify.com` link. These are not in the RSS
  feed — the feed only has creator-dashboard URLs — so all 22 were looked up
  against Spotify one at a time. A new episode's link has to be copied from
  Spotify by hand.
- `reading` is the article, book or campaign the episode points at. Every label
  and URL comes from the episode's own show notes; nothing there was invented.
  The boilerplate that ends every description ("Read Notes from Below",
  "Support the Podcast", the editors' email, the production credits) was
  dropped rather than repeated 22 times.
- **One known error in the feed, carried over deliberately.** EP-15's show notes
  print one article URL and link to a different one. The printed URL matches the
  episode; that is the one in the record. Worth a check.

## Journal

The 11 records are issues **17 to 27** of *Notes from Below*, scraped from
`https://notesfrombelow.org/issue/<slug>` in August 2026. Things to know before
adding J-28:

- **The ref carries the publisher's own printed number.** J-17 is issue 17, so
  the refs start at 17 and there is no J-01 to J-16. This is the opposite of
  the audio decision, and deliberately so: NFB's issue numbers are printed on
  the cover and unambiguous, where the podcast's were not. `issueNumber` also
  holds the number as a number, so the refs could be renumbered without losing
  it. Issues 1–16 are not in the archive — Callum asked for 17 onwards.
- **The lead prose is NFB's own editorial introduction, verbatim.** Every word
  of every markdown body is theirs, lifted from the top of the issue page and
  not paraphrased. The only edit was closing a stray space before a comma in
  issue 17, left behind by their markup, and dropping the "The complete issue
  is also available as an EPUB & PDF file:" line from issues 26 and 27, which
  is the page's furniture pointing at the download buttons.
- **The newer issues have a one-paragraph body, and that is correct.** From
  issue 23 on, NFB moved the editorial off the issue page and into a separate
  article — "Editorial: Why do inquiry today?" is item 01 of J-27's contents,
  and the paragraph on the issue page is a teaser for it. So J-23, J-25, J-26
  and J-27 have one paragraph of lead prose where J-17 has five. **Checked with
  Callum, August 2026: leave them.** Padding them out of the linked editorial
  was offered and rejected — those are full essays that open on an anecdote or
  an epigraph, so any excerpt reads as cut off rather than as an introduction.
  The rule stays simple: every body is the issue page's own intro, verbatim.
- **The one-line `description` on each record is the only invented text.**
  Eleven sentences, drafted from the editorial to give the index row something
  to say — NFB's own meta description is "The April 2023 issue of Notes From
  Below" for all of them, which is no use. These are the lines to check.
- **There is no `factsLine`.** As with audio, the index row's facts column is
  derived — here from the length of `contents` — so it cannot go stale.
- `contents` is the issue's full table of contents in published order: title,
  authors joined with commas, and an absolute link to the article on NFB.
  100 articles across the 11 issues.
- `downloads` is the whole issue as a file, which only issues 26 and 27 offer.
  `format` is the file type and becomes the field label, so it renders as
  "EPUB Download →".

## Writing

The 19 records are Callum's published articles, scraped from the seven outlets
that published them in August 2026, from a list of URLs Callum gave. Things to
know before adding W-20:

- **Refs run oldest first**, as the books do: W-01 is January 2018 and W-19 is
  August 2024. The index sorts them newest-first off the ref, so a new piece
  takes the next number up.
- **The prose is the publisher's, but the standfirsts are trimmed, not
  quoted.** The one-line `description` starts as the outlet's own standfirst,
  lifted from the page's `og:description` meta tag; for the three research
  articles it is the opening sentence of the abstract. The full abstract is the
  markdown body, which is why only W-07, W-14 and W-16 have one.
- **Every mention of Callum has been cut out of the standfirsts, on his
  instruction, August 2026.** Seven of them named him — the Guardian's ended
  "says sociologist Callum Cant", Novara's "writes Callum Cant", NFB's W-19
  opened "George and Callum critically examine". In an archive of his own
  writing the third person read as though someone else were describing him.
  The substance of each line is still the outlet's; only the attribution went.
  Three needed more than a clean cut, and those three lines are part mine:
  **W-10**, where the attribution was the whole second sentence, so "Callum
  Cant reports on the longest strike to ever hit the UK gig economy" became an
  em-dashed clause on the first; **W-15**, where cutting "asks the sociologist
  and author Callum Cant" left a comma that had to become a question mark; and
  **W-19**, reworded to "A critical examination of…" because the names were the
  subject of the sentence. Check those three.
- **W-04's typo was fixed, not carried.** Vice's standfirst read "have shown
  its possible"; it now reads "it's". Same instruction, same day.
- **Three articles are peer-reviewed research, and they carry `citation` and
  `doi`.** Both are optional, so a piece of journalism simply leaves them off
  and the facts column shows publication and date alone.
- **W-16's year is contestable.** *The poverty of ethical AI* went online at
  Springer on 20 December 2023 but was printed in AI & Society 40(2), which is
  February 2025. The record says 2023 — first publication — and the citation
  carries the volume. If it should be cited as 2025, that is a one-field change.
- **How each site was read.** Novara, Vice, the Guardian and Notes from Below
  are plain server-rendered pages: `curl` them and read `og:title` and
  `og:description`. NFB puts the byline in the description as "by Callum Cant
  // standfirst", so the prefix was stripped, and its date is in a
  `<meta name="date">` tag. **The three publishers cannot be scraped the same
  way** — Springer 303-redirects to an identity provider, and Sage returns its
  homepage to anything that is not a browser. Their metadata and abstracts came
  from **the Crossref API** instead: `https://api.crossref.org/works/<doi>`
  returns title, authors, container, dates, volume, issue, pages and the
  abstract as JSON. That is the route to use for any future journal article.
- **The bodies are stored but not shown.** The writing index renders the
  one-line description only, so the three abstracts sit in the repo unused.
  Showing them is a change to `src/pages/writing/index.astro` and nothing else.

## Books

The three records are Callum's own books, scraped from each publisher in August
2026. `B-01` is the oldest, so the refs run with the years: 2019, 2024, 2026.

- **`authors` is a required field, because two of the three are co-authored.**
  Feeding the Machine is Muldoon, Graham and Cant; The Future in Our Past is
  Cant and Lee. Without the field the books page would print all three as
  Callum's alone.
- **The body is the publisher's own blurb, verbatim**, as with the journal. The
  invented text is the one-line `summary` on each — three sentences, for the
  home page row. Those are the lines to check.
- `href` makes the ORDER label a working link to the publisher's page. It is
  optional: leave it off and the action renders as plain text, which is what an
  out-of-print book wants.
- `facts` stays one fact per line and **does not repeat the year**, which the
  ref column already carries. Three lines fit the 190px column; a fourth or a
  longer line wraps.
- **Polity's site is a JavaScript app and cannot be curled** — the page is an
  empty shell. Its data comes from a WordPress backend at
  `polity-books-backend.prod.politybooks.wiley.host/wp-json/book/v1/bookdetail/GB/<slug>`,
  which returns the description, extent, publication date and every format's
  price and ISBN as JSON. Canongate and Verso are both plain server-rendered
  pages; Verso's details are in its `ld+json` Book block.
- Prices and formats are as listed in August 2026 and **will go stale** — they
  are the only fields here that change on their own.

## Order of work

Callum's order — the photo sequences first, because they are the spine of
the archive.

1. **Sequence records** — 9 fields each. Gets all fifteen disputes onto the site
   with working pages, before any photograph exists. Twelve to go, running on
   from `S-04`.
2. **Sequence detail and plates** — the heavy one. Needs the photographs, and
   every location, date and time typed by hand (no EXIF).
3. ~~**Books**~~ — done, August 2026. Three books, scraped from their publishers.
4. ~~**Audio**~~ — done, August 2026. All 22 episodes with a page each.
5. ~~**Journal**~~ — done, August 2026. Issues 17-27, with a page each.
6. ~~**Writing**~~ — done, August 2026. Nineteen articles, scraped from the
   seven outlets that published them.

Batches of five to eight records per exchange: big enough to be worth the round
trip, small enough to check before moving on.

## Conventions

- Refs: `S-nn` photo sequences, `B-nn` books, `J-nn` journal, `EP-nn` audio, `W-nn`
  writing. Zero-padded — **order on the page is derived from the ref**, so a
  malformed one sorts to the wrong place.
- Filenames are lowercase refs: `s-03.md`, `ep-64.md`. The filename is the URL.
- Sequences sort ascending (S-01 first). Everything else sorts newest-first.
- Every field in the schema is required. A record that isn't ready yet should
  not be committed half-filled — it will fail the build.

## Photographs

- Go in `src/assets/photographs/`, named `s03-01.jpg` and so on, referenced from
  frontmatter by relative path.
- **Run `npm run photos` before committing any new batch.** It strips every
  metadata tag and downscales to 2560px. This is a safety requirement, not an
  optimisation — see CLAUDE.md. The script is safe to re-run and skips files
  that are already done.
- Straight-from-camera files carry around 54 tags including the camera body
  serial number. Check the script's output says `clean` for every file.
- Because there is no EXIF, **every location, date and time is typed by hand**
  from Callum's notes. Budget for that: it is the slowest part of the job.

## Open questions

- **The writing target was "probably around 10"; nineteen articles landed.**
  The target in the table above and `scopeRecordTotal` in `src/data/archive.ts`
  were both raised to match, and `writingTotal` was deleted — the count now
  comes from the files. **Confirm these nineteen are the whole of it.** If more
  are still to come, the writing count on the home page will understate itself
  until they land, which is the situation the stated totals existed to solve.
- **The scope line reads `70 RECORDS · 2018 —`**, the sum of the five targets:
  15 + 3 + 11 + 22 + 19. It was 61 when writing was targeted at 10, and the
  start year was 2019 until Callum corrected it to 2018 in August 2026 — the
  year of the earliest record in the archive, W-01. Only the sequences are
  still short of their target, so this becomes countable — and `archive.ts`
  becomes deletable — once all fifteen have landed.
- **The masthead reads "AN ARCHIVE OF CLASS STRUGGLE IN BRITAIN"**, Callum's
  wording, August 2026. **The list of formats that used to follow it —
  "PHOTOGRAPHS, BOOKS, PODCASTS, JOURNAL, WRITING" — went with the rewrite**,
  and is recorded here in case it is wanted back.
- **The home page shows three of every section.** `homeShown` in
  `src/pages/index.astro` is a single number slicing all five; the count beside
  each heading is the collection's real length, counted from the files.
- **The reader sees "photo sequences", the code still says `series`.** Renamed
  in the visible copy only, August 2026, on Callum's instruction, and the URLs
  were deliberately left alone: `/series/s-03` and the `S-nn` refs are
  unchanged, as is the content folder. The nav item reads "Photo", the index
  column header reads "SEQUENCE", the footer link reads "Sequence index".
- **Every nav item goes somewhere now.** Index was replaced by About, and
  `/about` exists. It is three fields — bio, email, licence. **The bio is
  Callum's own paragraph**, edited twice by him on the day it landed: "the
  founding editor" became "a founding editor", and the publishers were struck
  out of the book list, leaving the years. That last edit also settled a
  disagreement — his first draft said Bloomsbury for Feeding the Machine where
  `B-02` says Canongate, and no publisher is named on the page now.
- **All the index headings and subheads are Callum's copy, rewritten by him in
  August 2026.** Every one is a fragment with no closing full stop,
  deliberately. The Photos page lost its "Three disputes, 44 frames" headline
  for the single word "Photos", so the frame count now appears only on the home
  page; the writing page's subhead lost the count, the date range and the list
  of outlets, all of which had been derived from the records.
- **`objectPosition` was being dropped on two pages.** The home and Photos
  pages did not pass it to `PhotoRecord`, so both centred their featured
  photograph regardless of what the record said, cutting the courier's helmet
  off on Photos and the raised hands on the home page. Fixed August 2026 —
  the value in the record is honoured now. It is a silent failure, so it is
  worth eyeballing rather than trusting.
- **The index headlines compute their own numbers.** `numberWord()` in
  `src/data/archive.ts` spells the count out, so "Four disputes" above a list
  of six cannot happen again; `books/index.astro` uses it too.
- **The archive is licensed `CC BY-NC-ND 4.0`**, on Callum's instruction,
  August 2026, replacing the "FREE TO UNIONS AND CAMPAIGNS" footer line. He
  asked for "CC BY-NC-ND"; **the 4.0 was added here**, because a Creative
  Commons licence without a version number does not identify its terms and the
  link has to land on a specific deed. **Worth him knowing what ND costs:**
  under the old line a union could do as it liked with a photograph. Under ND
  they may reproduce it whole and credited, but may not crop it, overlay text
  on it, or use it in a montage — which is most of what a leaflet does with a
  picture. If that is not the intent, CC BY-NC is the same licence without
  that restriction.
- **All four publication indexes were rebuilt to the sequence index's shape**
  in August 2026 — blue heading block, rows on cream, photograph at the foot.
  **Books changed too, though Callum only named journal, writing and audio**:
  he asked for those three to match "photo and books", and books was still all
  blue, so matching it would have meant leaving them blue as well. Reverting
  books alone is one prop and one component swap.
