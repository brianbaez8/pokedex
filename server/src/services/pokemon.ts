import { ApiDef } from "../../../ui/src/common/types";
import { Pokemon } from "../../../ui/src/common/classes/Pokemon/Pokemon";
import { PokemonDef } from "../../../ui/src/common/types";
import { Request } from "express";
import { getEvolutionChainNames } from "../utils";

interface ResultsCount {
  results: { name: string; url: string }[];
  count: number;
}
export default class PokemonService {
  private static async getPokemonsDetails(
    pokemonArr: { name: string; url: string }[]
  ): Promise<PokemonDef.Pokemon[]> {
    return Promise.all(
      pokemonArr.map(async (pokemon) => {
        const pokemonDetails = await fetch(pokemon.url, {
          method: "GET",
        }).then((res) => res.json());

        const firstNonEmptySprite = Object.entries(pokemonDetails.sprites).find(
          ([key, value]) => value !== null
        );
        const pok: PokemonDef.Pokemon = {
          id: pokemonDetails.id,
          name: pokemonDetails.name,
          types: pokemonDetails.types.map(
            (type: { type: { name: string } }) => type.type.name
          ),
          weight: pokemonDetails.weight,
          height: pokemonDetails.height,
          order: pokemonDetails.order,
          sprites: (firstNonEmptySprite?.[1] as string) || "",
        };

        const newPokemon = new Pokemon(pok);

        return newPokemon;
      })
    );
  }

  private static async handleFilterQuery(
    filters: ApiDef.FilterQuery,
    pokemonsArr: ResultsCount
  ): Promise<ResultsCount> {
    if (filters.location) {
      pokemonsArr = await this.getPokemonByLocation(filters.location);

      if (filters.limit && filters.offset) {
        // Slice the results based on the limit and offset when type is provided
        const limitedResults = pokemonsArr.results.slice(
          Number(filters.offset),
          Number(filters.limit) + Number(filters.offset)
        );
        pokemonsArr = {
          results: limitedResults,
          count: pokemonsArr.count,
        };
      }
    } else if (filters.type) {
      pokemonsArr = await this.getPokemonByType(filters.type);

      if (filters.limit && filters.offset) {
        // Slice the results based on the limit and offset when type is provided
        const limitedResults = pokemonsArr.results.slice(
          Number(filters.offset),
          Number(filters.limit) + Number(filters.offset)
        );
        pokemonsArr = {
          results: limitedResults,
          count: pokemonsArr.count,
        };
      }
    }

    return pokemonsArr;
  }

  private static async handleWeightAndHeightQuery(
    filters: ApiDef.FilterQuery,
    pokemons: ResultsCount
  ): Promise<{ count: number; results: PokemonDef.Pokemon[] }> {
    if (filters.weight) {
      pokemons = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=1500&offset=0`,
        {
          method: "GET",
        }
      ).then((res) => res.json());

      const pokemonDetails = await this.getPokemonsDetails(pokemons.results);

      const filteredPokemons = pokemonDetails.filter(
        (pokemon) => pokemon.weight <= Number(filters.weight)
      );

      if (filters.limit && filters.offset) {
        const limitedResults = filteredPokemons.slice(
          Number(filters.offset),
          Number(filters.limit) + Number(filters.offset)
        );

        return { count: filteredPokemons.length, results: limitedResults };
      }

      return { count: filteredPokemons.length, results: filteredPokemons };
    }

    if (filters.height) {
      pokemons = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=1500&offset=0`,
        {
          method: "GET",
        }
      ).then((res) => res.json());

      const pokemonDetails = await this.getPokemonsDetails(pokemons.results);

      const filteredPokemons = pokemonDetails.filter(
        (pokemon) => pokemon.height <= Number(filters.height)
      );

      if (filters.limit && filters.offset) {
        const limitedResults = filteredPokemons.slice(
          Number(filters.offset),
          Number(filters.limit) + Number(filters.offset)
        );

        return { count: filteredPokemons.length, results: limitedResults };
      }

      return { count: filteredPokemons.length, results: filteredPokemons };
    }

    return { count: 0, results: [] };
  }

  public static async getPokemons(
    req: Request<{}, {}, {}, ApiDef.FilterQuery>
  ): Promise<{ count: number; results: PokemonDef.Pokemon[] }> {
    const params = new URLSearchParams({
      limit: req.query.limit?.toString() || "10",
      offset: req.query.offset?.toString() || "0",
      type: req.query.type || "",
    });
    try {
      let pokemonsArr: {
        results: { name: string; url: string }[];
        count: number;
      } = {
        results: [],
        count: 0,
      };

      if (req.query.location || req.query.type) {
        pokemonsArr = await this.handleFilterQuery(req.query, pokemonsArr);
      } else if (req.query.weight || req.query.height) {
        const pokemons = await this.handleWeightAndHeightQuery(
          req.query,
          pokemonsArr
        );
        return pokemons;
      } else {
        pokemonsArr = await fetch(
          `https://pokeapi.co/api/v2/pokemon?${params.toString()}`,
          {
            method: "GET",
          }
        ).then((res) => res.json());
      }

      const pokemons = await this.getPokemonsDetails(pokemonsArr.results);

      return {
        count: pokemonsArr.count,
        results: pokemons,
      };
    } catch (e) {
      console.error("Error fetching Pokémon:", e);
    }

    return { count: 0, results: [] };
  }

  public static async getPokemonById(
    id: string
  ): Promise<PokemonDef.Pokemon | null> {
    try {
      const pokemonDetails = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${id}`,
        {
          method: "GET",
        }
      ).then((res) => res.json());

      const firstNonEmptySprite = Object.entries(pokemonDetails.sprites).find(
        ([key, value]) => value !== null
      );
      const pok: PokemonDef.Pokemon = {
        id: pokemonDetails.id,
        name: pokemonDetails.name,
        types: pokemonDetails.types.map(
          (type: { type: { name: string } }) => type.type.name
        ),
        weight: pokemonDetails.weight,
        height: pokemonDetails.height,
        order: pokemonDetails.order,
        sprites: (firstNonEmptySprite?.[1] as string) || "",
      };

      const pokemonSpecies = await fetch(pokemonDetails.species.url, {
        method: "GET",
      }).then((res) => res.json());

      const evolutionChainUrl = pokemonSpecies?.evolution_chain.url;

      const evolutionChainResponse = await fetch(evolutionChainUrl, {
        method: "GET",
      }).then((res) => res.json());

      if (evolutionChainResponse?.chain) {
        pok.evolutionChain = getEvolutionChainNames(
          evolutionChainResponse.chain
        );
      }

      const pokemon = new Pokemon(pok);

      return pokemon;
    } catch (e) {
      console.error("Error fetching Pokémon:", e);
    }
    return null;
  }

  public static async getTypes(): Promise<string[]> {
    try {
      const types = await fetch("https://pokeapi.co/api/v2/type", {
        method: "GET",
      }).then((res) => {
        return res.json();
      });
      return types.results.map((type: { name: string }) => type.name);
    } catch (e) {
      console.error("Error fetching types:", e);
    }
    return [];
  }

  private static async getPokemonByType(
    type: string
  ): Promise<{ results: { name: string; url: string }[]; count: number }> {
    try {
      const typeDetails = await fetch(
        `https://pokeapi.co/api/v2/type/${type}`
      ).then((response) => response.json());

      const results = typeDetails.pokemon.map(
        (pokemon: { pokemon: { name: string; url: string } }) => pokemon.pokemon
      );

      const count = typeDetails.pokemon.length;

      return {
        results: results,
        count,
      };
    } catch (error) {
      console.error("Error fetching Pokémon:", error);
    }
    return { results: [], count: 0 };
  }

  public static async getLocations(): Promise<{
    name: string;
    id: number;
  } | null> {
    try {
      const locations = await fetch("https://pokeapi.co/api/v2/location", {
        method: "GET",
      }).then((res) => {
        return res.json();
      });

      return locations.results.map(
        (location: { name: string; url: string }) => {
          const id = location.url.split("/").slice(-2)[0];
          return { name: location.name, id: id };
        }
      );
    } catch (e) {
      console.error("Error fetching locations:", e);
    }
    return null;
  }

  private static async getPokemonByLocation(
    location: string
  ): Promise<{ results: { name: string; url: string }[]; count: number }> {
    try {
      const locationAreaDetails = await fetch(
        `https://pokeapi.co/api/v2/location-area/${location}`
      ).then((response) => response.json());

      const results = locationAreaDetails.pokemon_encounters.map(
        (pokemon: { pokemon: { name: string; url: string } }) => pokemon.pokemon
      );

      const count = locationAreaDetails.pokemon_encounters.length;

      return {
        results: results,
        count,
      };
    } catch (error) {
      console.error("Error fetching Pokémon:", error);
    }
    return { results: [], count: 0 };
  }
}
