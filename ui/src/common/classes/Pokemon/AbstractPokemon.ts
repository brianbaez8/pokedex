import { PokemonDef } from "../../types";

export abstract class AbstractPokemon {
  id?: number;
  name: string;
  types: string[];
  weight: number;
  height: number;
  order: number;
  sprites?: string;
  evolutionChain?: { name: string; id: number }[];

  constructor(pokemon: PokemonDef.Pokemon) {
    this.id = pokemon.id;
    this.name = pokemon.name;
    this.types = pokemon.types;
    this.weight = pokemon.weight;
    this.height = pokemon.height;
    this.order = pokemon.order;
    this.sprites = pokemon.sprites;
    this.evolutionChain = pokemon.evolutionChain;
  }

  abstract getName(): string;
  abstract getTypesString(): string[];
  abstract getTypes(): string;
  abstract getWeight(): number;
  abstract getHeight(): number;
  abstract getOrder(): number;
  abstract getEvolutions(): Promise<string[]>;
  abstract getNextEvolutionName(): Promise<string>;
}
