// Types for the content collections, derived from the schemas in
// src/content.config.ts. Change a schema and these follow automatically.
import type { CollectionEntry } from "astro:content";

export type SeriesEntry = CollectionEntry<"series">;
export type SeriesData = SeriesEntry["data"];
export type SeriesDetail = NonNullable<SeriesData["detail"]>;
export type SeriesRecordFields = SeriesDetail["record"];

export type Plate = SeriesDetail["plates"][number];
export type FullBleedPlate = Extract<Plate, { kind: "full" }>;
export type PairedPlate = Extract<Plate, { kind: "paired" }>;
export type SmallPlate = Extract<Plate, { kind: "small" }>;
export type PortraitPlate = Extract<Plate, { kind: "portrait" }>;
export type DiptychPlate = Extract<Plate, { kind: "diptych" }>;

export type BookEntry = CollectionEntry<"books">;
export type FrameEntry = CollectionEntry<"frames">;
