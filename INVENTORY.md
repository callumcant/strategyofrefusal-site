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
| Audio    | 22 | 0 | —   | Collection and page built, empty |
| Writing  | 10 | 3 | no  | Placeholder records; target to be confirmed |
| Frames   | 3  | 3 | no  | Featured photograph per shell page |

Everything in `src/content/` other than S-01, S-05 and S-06 is sample data from
the original build and should be treated as disposable.

## Order of work

Callum's order — series first, because it is the spine of the archive.

1. **Series records** — 9 fields each. Gets all fifteen disputes onto the site
   with working pages, before any photograph exists. Replaces S-02 to S-04.
2. **Series detail and plates** — the heavy one. Needs the photographs, and
   every location, date and time typed by hand (no EXIF).
3. **Books** — 5 fields plus a description in the body. Current three are wrong.
4. **Audio** — 5 fields each. Machinery is ready and waiting.
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
- **Audio has no section on the home page**, unlike the other four collections.
  Deliberate for now; add one if it should appear there.
- **Journal, Writing and Index are still dead nav items.** Journal and Writing
  have collections but no page; Index has neither.
- **The series index headline still reads "Four disputes".** It is hardcoded in
  `src/pages/series/index.astro`; there are now six. The frame count beside it
  is derived and correct. Callum's copy — spelled-out numbers, so it cannot
  simply be computed.
