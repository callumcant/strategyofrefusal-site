# Archive inventory

What the archive should hold, and how much of it has actually landed. This is
the working record for filling the site — **update it in the same commit as the
content**, because it is the only thing that survives between sessions.

Target sizes given by Callum, August 2026.

| Collection | Target | Landed | Real? | Status |
| --- | --- | --- | --- | --- |
| Series   | 15 | 4 | no  | Placeholder records; all four need replacing |
| Books    | 3  | 3 | no  | Right number, wrong books — replace all three |
| Journal  | 11 | 2 | no  | Placeholder records |
| Audio    | 22 | 0 | —   | Collection and page built, empty |
| Writing  | 10 | 3 | no  | Placeholder records; target to be confirmed |
| Frames   | 3  | 3 | no  | Featured photograph per shell page |

Nothing in `src/content/` is real content yet. Every record currently in the
repo is sample data from the original build and should be treated as disposable.

## Order of work

Callum's order — series first, because it is the spine of the archive.

1. **Series records** — 9 fields each. Gets all fifteen disputes onto the site
   with working pages, before any photograph exists. Replaces S-01 to S-04.
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

- Go in `src/assets/photographs/`, referenced from frontmatter by relative path.
- **EXIF must be stripped before a photograph enters the repo.** This is a
  safety requirement, not a preference — see CLAUDE.md.
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
