export interface Book {
  ref: string;
  year: string;
  title: string;
  summary: string; // short row description, used on the home page
  description: string; // longer paragraph, used on the books page
  factsLine: string; // e.g. "Verso · 288pp · £14.99" — used on the home page
  facts: string[]; // multi-line mono block used on the books page
  action: string; // "ORDER" | "DOWNLOAD PDF"
}

export const books: Book[] = [
  {
    ref: "B-03",
    year: "2025",
    title: "The unpaid walk",
    summary: "Nights, agencies and the eight minutes before the shift. Written out of S-02.",
    description:
      "Nights, agencies and the eight minutes before the shift. Written out of the two winters in S-02, with the ballot at its centre.",
    factsLine: "Verso · 288pp · £14.99",
    facts: ["VERSO · 288PP", "PAPERBACK £14.99", "AUDIO, READ BY THE AUTHOR"],
    action: "ORDER",
  },
  {
    ref: "B-02",
    year: "2022",
    title: "Hold the gate",
    summary: "Six recognition fights, told by the stewards who ran them.",
    description:
      "Six recognition fights, told by the stewards who ran them. Interviews recorded 2019–21.",
    factsLine: "Pluto · 214pp · £12.99",
    facts: ["PLUTO · 214PP", "PAPERBACK £12.99", "THIRD PRINTING"],
    action: "ORDER",
  },
  {
    ref: "B-01",
    year: "2019",
    title: "Small numbers, sharp ends",
    summary: "Out of print; the PDF is free to download.",
    description: "First attempt at the argument. Out of print and staying that way; the PDF is free.",
    factsLine: "Self-published · 96pp",
    facts: ["SELF-PUBLISHED · 96PP", "OUT OF PRINT"],
    action: "DOWNLOAD PDF",
  },
];
