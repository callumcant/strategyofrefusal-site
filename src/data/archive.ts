// Numbers the archive states about itself that cannot be counted from the
// published records, because the archive is larger than what is published:
// the home page lists a selection but states the true size.
//
// These are the ones that go stale. Everything countable — the series and
// books totals, the frame count — is derived at build time instead.
export const journalTotal = 7;
export const writingTotal = 11;
export const scopeRecordTotal = 68;
export const scopeSince = "2019";

// Two-digit count: 4 → "04", 12 → "12".
// (This replaced a literal "0" glued to the front, which rendered "010" at ten.)
export function pad(n: number): string {
  return String(n).padStart(2, "0");
}
