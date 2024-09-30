export interface Pokemon {
  name: string;
  types: string[];
  weight: number;
  height: number;
  order: number;
  sprites?: string;
  id?: number;
  evolutionChain?: { name: string; id: number }[];
}
