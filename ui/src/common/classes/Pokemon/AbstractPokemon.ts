import { PokemonDef } from '../../types';

export abstract class AbstractPokemon {
  name: string
  types: string[]
  weight: number
  height: number
  order: number

  constructor(pokemon: PokemonDef.Pokemon) {
    this.name = pokemon.name;
    this.types = pokemon.types;
    this.weight = pokemon.weight;
    this.height = pokemon.height;
    this.order = pokemon.order;
  }

  abstract getName(): string;
  abstract getTypesString(): string[];
  // TODO: Properly Type Types depending on the implementation
  abstract getTypes(): unknown[];
  abstract getWeight(): number;
  abstract getHeight(): number;
  abstract getOrder(): number;
  // TODO Properly Type Evolutions depending on implementation
  abstract getEvolutions(): unknown;
  abstract getNextEvolutionName(): string;
}