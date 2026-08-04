export interface Artist {
  id: string;
  name: string;
  country: string;
  studio: string;
  style: string;
  instagram: string;
  bio: string;
  photoUrl: string;
  photoPath: string;
  createdAt: number;
}

export type NewArtist = Omit<Artist, "id" | "createdAt">;

export interface ScheduleItem {
  id: string;
  day: 1 | 2;
  time: string;
  stage: string;
  title: string;
  description: string;
  createdAt: number;
}

export type NewScheduleItem = Omit<ScheduleItem, "id" | "createdAt">;

export interface Sponsor {
  id: string;
  name: string;
  logoUrl: string;
  logoPath: string;
  website: string;
  description: string;
  createdAt: number;
}

export type NewSponsor = Omit<Sponsor, "id" | "createdAt">;

export interface GalleryImage {
  id: string;
  imageUrl: string;
  storagePath: string;
  caption: string;
  createdAt: number;
}

export type NewGalleryImage = Omit<GalleryImage, "id" | "createdAt">;

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  order: number;
  createdAt: number;
}

export type NewFaqItem = Omit<FaqItem, "id" | "createdAt">;

/** A single award category (e.g. "Best Traditional Tattoo") inside a
 * judging group (e.g. "Healed Tattoo Competition") on a given day. */
export interface BattleCategory {
  id: string;
  day: 1 | 2;
  groupName: string;
  itemNumber: string;
  itemText: string;
  order: number;
  createdAt: number;
}

export type NewBattleCategory = Omit<BattleCategory, "id" | "createdAt">;
