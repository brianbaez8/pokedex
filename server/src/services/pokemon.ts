import { getEvolutionChainNames, parseLocationName } from "../utils";

import { ApiDef } from "../../../ui/src/common/types";
import { Pokemon } from "../../../ui/src/common/classes/Pokemon/Pokemon";
import { PokemonDef } from "../../../ui/src/common/types";
import { Request } from "express";

interface ResultsCount {
  results: { name: string; url: string }[];
  count: number;
}
export default class PokemonService {
  private static async getPokemonsDetails(
    pokemonArr: { name: string; url: string }[]
  ): Promise<(PokemonDef.Pokemon | undefined)[]> {
    return Promise.all(
      pokemonArr.map(async (pokemon) => {
        const pokemonId = pokemon.url.split("/").slice(-2)[0];
        const pokemonDetails = await this.getPokemonById(pokemonId).then(
          (res) => res
        );

        if (pokemonDetails && pokemonDetails.sprites) {
          const firstNonEmptySprite = Object.entries(
            pokemonDetails.sprites
          ).find(([key, value]) => value !== null);

          const pok = new Pokemon(pokemonDetails);

          const newPokemon = new Pokemon(pok);

          return newPokemon;
        }
      })
    );
  }

  private static async handleFilters(
    pokemons: PokemonDef.Pokemon[],
    filters: ApiDef.FilterQuery
  ): Promise<{ count: number; results: PokemonDef.Pokemon[] }> {
    let filteredPokemons: PokemonDef.Pokemon[] = pokemons;

    if (filters.type) {
      filteredPokemons = filteredPokemons.filter((pokemon) => {
        return pokemon.types.includes(filters.type!);
      });
    }

    if (filters.location) {
      filteredPokemons = filteredPokemons.filter((pokemon) => {
        return pokemon.locations?.includes(filters.location!);
      });
    }

    if (filters.weight) {
      filteredPokemons = filteredPokemons.filter(
        (pokemon) => pokemon.weight <= Number(filters.weight)
      );
    }

    if (filters.height) {
      filteredPokemons = filteredPokemons.filter(
        (pokemon) => pokemon.height <= Number(filters.height)
      );
    }

    const filteredPokemonsPaginated = this.handlePagination(
      filteredPokemons,
      filters.limit,
      filters.offset
    );

    return {
      count: filteredPokemonsPaginated.count,
      results: filteredPokemonsPaginated.results,
    };
  }

  private static handlePagination = (
    pokemons: PokemonDef.Pokemon[],
    limit?: number,
    offset?: number
  ): { count: number; results: PokemonDef.Pokemon[] } => {
    if (limit && offset) {
      const limitedResults = pokemons.slice(
        Number(offset),
        Number(limit) + Number(offset)
      );

      return { count: pokemons.length, results: limitedResults };
    }

    return { count: pokemons.length, results: pokemons };
  };

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
        results: PokemonDef.Pokemon[];
        count: number;
      } = {
        results: [],
        count: 0,
      };

      const onlyType =
        req.query.type &&
        !req.query.location &&
        !req.query.weight &&
        !req.query.height;
      const noFilters =
        !req.query.type &&
        !req.query.location &&
        !req.query.weight &&
        !req.query.height;

      if (noFilters) {
        const pokemons = await fetch(
          `https://pokeapi.co/api/v2/pokemon?${params.toString()}`,
          {
            method: "GET",
          }
        ).then((res) => res.json());

        const pokemonDetails = await this.getPokemonsDetails(pokemons.results);

        const filteredPokemonsPaginated = this.handlePagination(
          pokemonDetails as PokemonDef.Pokemon[],
          req.query.limit,
          req.query.offset
        );

        return {
          count: pokemons.count,
          results: filteredPokemonsPaginated.results,
        };
      }

      // SINCE THE API ALLOWS TO PAGINATE BY TYPE
      // WE DON'T NEED TO FETCH ALL POKEMONS
      if (onlyType) {
        const pokemonsByType = await this.getPokemonByType(
          req.query.type as string
        );

        const pokemonDetails = await this.getPokemonsDetails(
          pokemonsByType.results
        );

        const filteredPokemonsPaginated = this.handlePagination(
          pokemonDetails as PokemonDef.Pokemon[],
          req.query.limit,
          req.query.offset
        );

        return {
          count: filteredPokemonsPaginated.count,
          results: filteredPokemonsPaginated.results,
        };
      }

      // GET ALL POKEMONS
      const result = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=1500&offset=0`,
        {
          method: "GET",
        }
      ).then((res) => res.json());

      // GET ALL POKEMONS DETAILS
      const pokemonDetails = await this.getPokemonsDetails(result.results);

      // HANDLE FILTERS
      if (pokemonDetails) {
        pokemonsArr = await this.handleFilters(
          pokemonDetails as PokemonDef.Pokemon[],
          req.query
        );
      }

      return {
        count: pokemonsArr.count,
        results: pokemonsArr.results,
      };
    } catch (e) {
      console.error("Error fetching Pokémon:", e);
      throw new Error("Error fetching Pokémons");
    }
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

      if (pokemonDetails?.location_area_encounters) {
        const results = await fetch(pokemonDetails.location_area_encounters, {
          method: "GET",
        }).then((res) => res.json());

        pok.locations = results.map(
          (location: { location_area: { name: string } }) =>
            parseLocationName(location.location_area.name)
        );
      }

      const pokemon = new Pokemon(pok);

      return pokemon;
    } catch (e) {
      console.error("Error fetching Pokémon2:", e);
      throw new Error("Error fetching Pokémon");
    }
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
      throw new Error("Error fetching types");
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
      console.error("Error fetching Pokémon3:", error);
      throw new Error("Error fetching Pokémon by type");
    }
  }

  public static async getLocations(): Promise<{
    name: string;
    id: number;
  }> {
    try {
      const locations = await fetch(
        "https://pokeapi.co/api/v2/location?limit=1050",
        {
          method: "GET",
        }
      ).then((res) => {
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
      throw new Error("Error fetching locations");
    }
  }
}
