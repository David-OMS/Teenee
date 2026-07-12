import type { IsoDateTime } from "@/types/common/iso-datetime";

export type WordOfTheDay = {
  french: string;
  english: string;
  example: string | null;
  shownOn: string;
  generatedAt: IsoDateTime;
};
