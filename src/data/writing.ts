export interface WritingPiece {
  ref: string;
  year: string;
  title: string;
  form: string;
}

export const writingTotal = 11;

export const writing: WritingPiece[] = [
  { ref: "W-11", year: "2024", title: "Notes on photographing your own workplace", form: "Essay · 2,400 words" },
  { ref: "W-10", year: "2025", title: "What a gate meeting is for", form: "Tribune" },
  { ref: "W-09", year: "2023", title: "The depot is not a metaphor", form: "New Socialist" },
];
