import type { ImageMetadata } from "astro";
import { photos } from "./photos";

export interface FullBleedPlate {
  kind: "full";
  ref: string;
  image: ImageMetadata;
  alt: string;
  height: number;
  objectPosition?: string;
  location: string;
  date: string;
  time?: string;
  caption: string;
}

export interface PairedPlate {
  kind: "paired";
  ref: string;
  image: ImageMetadata;
  alt: string;
  location: string;
  date: string;
  caption: string;
  passage: string;
}

export interface SmallPlate {
  kind: "small";
  ref: string;
  image: ImageMetadata;
  alt: string;
  objectPosition?: string;
  location: string;
  date: string;
  caption: string;
}

export type Plate = FullBleedPlate | PairedPlate | SmallPlate;

export interface SeriesDetail {
  standfirst: string;
  record: {
    place: string;
    dates: string;
    employer: string;
    union: string;
    dispute: string;
    outcome: string;
    framesNote: string;
    related: { ref: string; href?: string }[];
  };
  note: string;
  plates: Plate[];
  next: { ref: string; title: string; href: string };
}

export interface SeriesRecord {
  ref: string;
  slug: string;
  title: string;
  place: string;
  employer: string;
  union: string;
  dispute: string;
  dateLabel: string;
  frames: number;
  outcome: string;
  indexDescription: string;
  detail?: SeriesDetail;
}

export const series: SeriesRecord[] = [
  {
    ref: "S-01",
    slug: "s-01",
    title: "Ninety minutes at Homerton",
    place: "Hackney",
    employer: "ISS (contract)",
    union: "UNISON",
    dispute: "Pay parity with directly employed porters",
    dateLabel: "2021",
    frames: 24,
    outcome: "WON",
    indexDescription:
      "Cleaners paid below the porters beside them; gate meeting before the early shift. 24 frames.",
  },
  {
    ref: "S-02",
    slug: "s-02",
    title: "Nights on the sorting floor",
    place: "Bow",
    employer: "Parcel hub",
    union: "CWU, Tower Hamlets",
    dispute: "Unpaid handover; agency parity",
    dateLabel: "2022–24",
    frames: 41,
    outcome: "LOST 51",
    indexDescription:
      "Eight unpaid minutes between barrier and sorter; two winters of nights. 41 frames.",
    detail: {
      standfirst:
        "The hub runs from ten at night until six. You clock on at the barrier and walk eight minutes to your sorter, and those eight minutes are not paid. Four hundred people, two hundred and forty nights.",
      record: {
        place: "Bow, east London",
        dates: "Nov 2022 – Mar 2024",
        employer: "Parcel hub; two agencies",
        union: "CWU, Tower Hamlets",
        dispute: "Unpaid handover; agency parity",
        outcome: "Ballot lost by 51, Mar 2024",
        framesNote: "41 · four shown",
        related: [{ ref: "B-03" }, { ref: "EP-64" }],
      },
      note: "Cameras are not permitted past the barrier. Every frame here was made with the permission of the people in it and nobody else.",
      plates: [
        {
          kind: "full",
          ref: "01 / 04",
          image: photos["4-DSCF8458"],
          alt: "Parcel on a conveyor seen through mesh",
          height: 530,
          location: "Sorter three, Bow hub",
          date: "14 January 2023, 23:10",
          time: "Night shift, hour one",
          caption:
            "The line does not stop for the handover, so the count is shouted across it. Everyone asked about this place mentions the noise first.",
        },
        {
          kind: "paired",
          ref: "02 / 04",
          image: photos["1-DSCF6025"],
          alt: "Worker resting on a bank outside the depot",
          location: "Bank behind the staff car park",
          date: "15 January 2023, 03:20",
          caption:
            "Kadri, second agency in four months, takes the twenty minutes outside. There is no break room on the night rota.",
          passage:
            "Nights make their own kind of solidarity. You know the six people on your line and nobody else in the building, and management changes every quarter — the only continuity on the floor is the workers. The ballot came out of a walkway conversation like this one, and so did the two stewards who are still there.",
        },
        {
          kind: "full",
          ref: "03 / 04",
          image: photos["3-DSCF2021"],
          alt: "Speaker with a microphone at the depot gate",
          height: 470,
          objectPosition: "50% 22%",
          location: "Depot gate, Bow",
          date: "9 March 2024, 06:15",
          time: "Result announced 05:40",
          caption:
            "Marcia, on loan from the Hackney hospital branch, speaks to the early shift the morning the ballot failed. Eleven people signed up on the pavement afterwards.",
        },
        {
          kind: "small",
          ref: "04 / 04",
          image: photos["2-DSCF2894"],
          alt: "Couriers with raised fists in the street",
          objectPosition: "50% 42%",
          location: "Farringdon Road, EC1",
          date: "9 March 2024, 09:30",
          caption:
            "Riders from the Clerkenwell group (S-03) came east to the gate the same morning.",
        },
      ],
      next: { ref: "S-03", title: "Fists on Farringdon Road", href: "/series/s-03" },
    },
  },
  {
    ref: "S-03",
    slug: "s-03",
    title: "Fists on Farringdon Road",
    place: "Clerkenwell",
    employer: "Platform",
    union: "IWGB",
    dispute: "Per-drop rate cut 24% without notice",
    dateLabel: "2023",
    frames: 18,
    outcome: "PART",
    indexDescription:
      "Per-drop rate cut 24% without notice; four days out and one ride-out. 18 frames.",
  },
  {
    ref: "S-04",
    slug: "s-04",
    title: "Site, roadside, nobody's canteen",
    place: "Ashford",
    employer: "Groundworks",
    union: "Unite",
    dispute: "No welfare cabin since June",
    dateLabel: "2024 —",
    frames: 22,
    outcome: "OPEN",
    indexDescription:
      "Three labour providers on one gate; no welfare cabin since June. 22 frames, open.",
  },
];

export function findSeries(slug: string): SeriesRecord | undefined {
  return series.find((s) => s.slug === slug);
}
