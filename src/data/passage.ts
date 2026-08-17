// A plate's passage is one string in the frontmatter, but a long quote often
// runs to more than one paragraph.
//
// Every passage in the archive is written in YAML's folded style (>-), which
// folds an ordinary line break into a space and turns a blank line into a
// single newline. So in a folded passage a newline only ever appears where the
// author left a blank line, and splitting on newlines is exactly "split where
// the author asked for a new paragraph".
//
// Note this means a passage written in literal style (|), where every line
// break survives, would come back as one paragraph per line. Nothing in the
// archive uses literal style; keep writing passages as >-.
export function paragraphs(passage: string | undefined): string[] {
  if (!passage) return [];
  return passage
    .split(/\n+/)
    .map((para) => para.trim())
    .filter(Boolean);
}
