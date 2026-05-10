
export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  UNISEX = 'Unisex'
}

export interface ModuleInfo {
  id: string;
  title: string;
  description: string;
  image: string;
  path: string;
}

export interface RecommendationResponse {
  outfitDescription: string;
  stylingTips: string[];
  colorPalette: string[];
  culturalSignificance: string;
}
