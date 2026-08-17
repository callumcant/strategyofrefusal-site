# Archive inventory

What the archive should hold, and how much of it has actually landed. This is
the working record for filling the site — **update it in the same commit as the
content**, because it is the only thing that survives between sessions.

Target sizes given by Callum, August 2026.

| Collection | Target | Landed | Real? | Status |
| --- | --- | --- | --- | --- |
| Series   | 15 | 6 | 3 real | S-05 Too Hot to Work is complete. S-06 The Death of a University has all 18 plates; 9 of them carry notes, the other 9 are still photograph-and-reference only. S-01 Chasing the Wildcat has all 17 plates but no prose at all — no standfirst and no passages. S-02 to S-04 are placeholder and need replacing |
| Books    | 3  | 3 | no  | Right number, wrong books — replace all three |
| Journal  | 11 | 2 | no  | Placeholder records |
| Audio    | 22 | 22 | **yes** | **Complete.** All 22 episodes of Workers' Inquiry, catalogued from the podcast's RSS feed. Every one has a record page at `/audio/ep-nn` |
| Writing  | 10 | 3 | no  | Placeholder records; target to be confirmed |
| Frames   | 3  | 3 | no  | Featured photograph per shell page |

Everything in `src/content/` other than S-01, S-05, S-06 and the audio
collection is sample data from the original build and should be treated as
disposable.

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

## Order of work

Callum's order — series first, because it is the spine of the archive.

1. **Series records** — 9 fields each. Gets all fifteen disputes onto the site
   with working pages, before any photograph exists. Replaces S-02 to S-04.
2. **Series detail and plates** — the heavy one. Needs the photographs, and
   every location, date and time typed by hand (no EXIF).
3. **Books** — 5 fields plus a description in the body. Current three are wrong.
4. ~~**Audio**~~ — done, August 2026. All 22 episodes with a page each.
5. **Journal** — 5 fields each.
6. **Writing** — 4 fields each, no prose. Target still to be confirmed.

Batches of five to eight records per exchange: big enough to be worth the round
trip, small enough to check before moving on.

## Conventions

- Refs: `S-nn` series, `B-nn` books, `J-nn` journal, `EP-nn` audio, `W-nn`
  writing. Zero-padded — **order on the page is derived from the ref**, so a
  malformed one sorts to the wrong place.
- Filenames are lowercase refs: `s-05.md`, `ep-64.md`. The filename is the URL.
- Series sort ascending (S-01 first). Everything else sorts newest-first.
- Every field in the schema is required. A record that isn't ready yet should
  not be committed half-filled — it will fail the build.

## Photographs

- Go in `src/assets/photographs/`, named `s05-01.jpg` and so on, referenced from
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

- **Writing target is provisional** — "probably around 10". Confirm before the
  writing totals in `src/data/archive.ts` are trusted.
- **The scope line reads `61 RECORDS · 2019 —`**, the sum of the five targets.
  It becomes countable — and `archive.ts` becomes deletable — once every
  collection holds its real records.
- **The masthead scope line does not mention audio.** It currently reads
  "PHOTOGRAPHS, BOOKS, JOURNAL, WRITING". Callum's copy to change, not mine.
- **The home page audio section shows the newest 4 of 22.** `audioShown` in
  `src/pages/index.astro` sets how many; the count beside the heading is the
  real total, counted from the files. Listing all 22 would swamp a page whose
  other sections run to two or three rows.
- **Journal, Writing and Index are still dead nav items.** Journal and Writing
  have collections but no page; Index has neither. Their home page section
  arrows are therefore unlinked too, while Series, Books and Audio point at
  their indexes.
- **`S-02` still cross-references `EP-64`, which does not exist** — the run only
  reaches EP-22. It is sample data inside a sample series, so it will go when
  S-02 is replaced, but a real series can now link an episode properly: a
  `related` entry takes an `href`, so `{ ref: EP-11, href: /audio/ep-11 }`
  renders as a working link.
- **The series index headline still reads "Four disputes".** It is hardcoded in
  `src/pages/series/index.astro`; there are now six. The frame count beside it
  is derived and correct. Callum's copy — spelled-out numbers, so it cannot
  simply be computed.
