export interface BreedImage {
  id: string;
  url: string;
  thumb: string;
  medium: string;
  large: string;
}

export interface BreedAttributes {
  name: string;
  description: string;
  life?: { min: number; max: number };
  male_weight?: { min: number; max: number };
  female_weight?: { min: number; max: number };
  hypoallergenic: boolean;
  images?: BreedImage[];
}

export interface BreedData {
  id: string;
  type: string;
  attributes: BreedAttributes;
}

export interface BreedCollectionResponse {
  data: BreedData[];
  meta: {
    pagination: {
      current: number;
      next?: number;
      last: number;
      records: number;
    };
  };
}