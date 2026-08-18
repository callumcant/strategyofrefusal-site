// Numbers the archive states about itself that cannot be counted from the
// published records, because the archive is larger than what is published:
// the home page lists a selection but states the true size.
//
// These are the ones that go stale. Everything countable — the series and
// books totals, the frame count — is derived at build time instead.
//
// Target sizes as of August 2026, from Callum:
//   series 15 · books 3 · journal 11 · audio 22 · writing 19
// Delete each of these the moment its collection holds every real record, and
// count the files instead. See INVENTORY.md for what has actually landed.
// journalTotal and writingTotal are both gone: all 11 issues and all 19
// articles are now records, so those counts come from the files like series,
// books and audio. Only the series are still short of their target, which is
// why the scope line below is the last stated number left.
export const scopeRecordTotal = 70; // sum of the five collection targets above
export const scopeSince = "2018";

// Every audio record is an episode of the same show, so the show's name lives
// here rather than being repeated in twenty-two frontmatter blocks.
// The show's own name. Its publisher is JOURNAL_NAME below — the record
// page's PODCAST field joins the two, and the audio index names them
// separately because each is a link to a different place.
export const PODCAST_NAME = "Workers' Inquiry";
export const PODCAST_URL = "https://open.spotify.com/show/0sQxWX7FVBzAIBumb67uEc";

// The same bargain for the journal: every issue is Notes from Below, so the
// publisher is named once here rather than in eleven frontmatter blocks.
export const JOURNAL_NAME = "Notes from Below";
export const JOURNAL_URL = "https://notesfrombelow.org";

// The licence the whole archive is published under, stated once so the footer
// mark and the About page cannot drift apart. The version number is part of
// the name on purpose: "CC BY-NC-ND" without one does not say which terms
// apply, and the link has to land on a specific deed.
export const LICENCE_NAME = "CC BY-NC-ND 4.0";
export const LICENCE_URL = "https://creativecommons.org/licenses/by-nc-nd/4.0/";
// Plain-language gloss of the three letters, for the About page. BY: credit
// the author. NC: no commercial use. ND: no cropped, edited or adapted
// versions may be shared on.
export const LICENCE_SUMMARY =
  "Copy and share it anywhere, so long as you credit the author, take no money for it, and pass it on unchanged.";

// Two-digit count: 4 → "04", 12 → "12".
// (This replaced a literal "0" glued to the front, which rendered "010" at ten.)
export function pad(n: number): string {
  return String(n).padStart(2, "0");
}

// The display headings spell their numbers out — "Three books", "Three photo
// sequences" — so pad() is no use there and the numerals used to be typed by
// hand, which is how the series index came to read "Four disputes" above a
// list of six. Counting past twenty falls back to the numeral rather than
// carrying a word list nothing will ever reach.
const NUMBER_WORDS = [
  "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight",
  "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
  "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty",
];

export function numberWord(n: number): string {
  return NUMBER_WORDS[n] ?? String(n);
}
