export interface JournalIssue {
  ref: string;
  year: string;
  title: string;
  description: string;
  factsLine: string;
}

export const journalTotal = 7;

export const journal: JournalIssue[] = [
  {
    ref: "J-07",
    year: "2025",
    title: "Contracts and cabins",
    description: "The Common Rate, issue 07. Edited with the Ashford and Hackney branches.",
    factsLine: "96pp · £8, free to members",
  },
  {
    ref: "J-06",
    year: "2024",
    title: "Who counts the hours",
    description: "Six earlier issues, all in the index. Back numbers posted at cost.",
    factsLine: "88pp",
  },
];
