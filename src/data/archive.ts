// Numbers the archive states about itself that cannot be counted from the
// published records, because the archive is larger than what is published:
// the home page lists a selection but states the true size.
//
// These are the ones that go stale. Everything countable — the series and
// books totals, the frame count — is derived at build time instead.
//
// Target sizes as of August 2026, from Callum:
//   series 15 · books 3 · journal 11 · audio 22 · writing ~10 (to be confirmed)
// Delete each of these the moment its collection holds every real record, and
// count the files instead. See INVENTORY.md for what has actually landed.
// journalTotal is gone: all 11 issues are now records, so the journal count is
// counted from the files like series, books and audio.
export const writingTotal = 10; // to be confirmed
export const scopeRecordTotal = 61; // sum of the five collection targets above
export const scopeSince = "2019";

// Every audio record is an episode of the same show, so the show's name lives
// here rather than being repeated in twenty-two frontmatter blocks.
export const PODCAST_NAME = "Workers' Inquiry, Notes from Below";
export const PODCAST_URL = "https://open.spotify.com/show/0sQxWX7FVBzAIBumb67uEc";

// The same bargain for the journal: every issue is Notes from Below, so the
// publisher is named once here rather than in eleven frontmatter blocks.
export const JOURNAL_NAME = "Notes from Below";
export const JOURNAL_URL = "https://notesfrombelow.org";

// Two-digit count: 4 → "04", 12 → "12".
// (This replaced a literal "0" glued to the front, which rendered "010" at ten.)
export function pad(n: number): string {
  return String(n).padStart(2, "0");
}
