import type { ImageMetadata } from "astro";
import { photos } from "./photos";

export interface FeaturedFrame {
  ref: string;
  image: ImageMetadata;
  alt: string;
  height: number;
  objectPosition?: string;
  location: string;
  date: string;
  extra?: string;
  caption: string;
  captionAccentRef?: string;
}

export const homeFeaturedFrame: FeaturedFrame = {
  ref: "S-03.04",
  image: photos["2-DSCF2894"],
  alt: "Rider with a raised fist among scooters and placards",
  height: 440,
  location: "Farringdon Road, EC1",
  date: "8 February 2023, 12:20",
  extra: "Delivery platform · IWGB",
  caption:
    "Yasmin, four years on the app, calls the ride-out on day three of the strike. The scooters held the road for forty minutes. Frame 04 of 18 in",
  captionAccentRef: "S-03",
};

export const seriesIndexFeaturedFrame: FeaturedFrame = {
  ref: "S-02.01",
  image: photos["4-DSCF8458"],
  alt: "Parcel on a conveyor seen through mesh",
  height: 360,
  location: "Sorter three, Bow hub",
  date: "14 January 2023, 23:10",
  caption: "The line does not stop for the handover, so the count is shouted across it.",
};

export const booksFeaturedFrame: FeaturedFrame = {
  ref: "S-04.01",
  image: photos["1-DSCF6025"],
  alt: "Worker resting on a bank beside a site",
  height: 400,
  objectPosition: "50% 36%",
  location: "Ashford, Kent",
  date: "3 October 2024, 12:15",
  caption:
    "Dritan, second agency in four months. The bank behind the compound is the break area; the welfare cabin has been promised since June.",
};
