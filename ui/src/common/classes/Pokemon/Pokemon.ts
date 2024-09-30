import { AbstractPokemon } from "./AbstractPokemon";
import axios from "axios";
export class Pokemon extends AbstractPokemon {
  // TODO: Implement This Class

  async getNextEvolution(name: string): Promise<string> {
    try {
      const { data } = await axios.get(
        `http://localhost:8080/pokemons/${name}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const evolutionChain = data?.evolutionChain;

      if (evolutionChain?.length === 0) {
        return Promise.resolve("");
      }

      const currentEvolutionIndex = evolutionChain.findIndex(
        (evolution: { name: string; id: number }) => evolution.name === name
      );

      if (currentEvolutionIndex === -1) {
        return Promise.resolve("");
      }

      if (
        evolutionChain[currentEvolutionIndex] &&
        evolutionChain[currentEvolutionIndex + 1]
      ) {
        return Promise.resolve(evolutionChain[currentEvolutionIndex + 1].name);
      }
    } catch (error) {
      console.error("Error fetching Pokémon:", error);
      Promise.reject(error);
    }

    return Promise.resolve("");
  }

  async getAllNextEvolutions(name: string): Promise<string[]> {
    try {
      const { data } = await axios.get(
        `http://localhost:8080/pokemons/${name}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const evolutionChain = data?.evolutionChain;

      if (evolutionChain?.length === 0) {
        return Promise.resolve([""]);
      }

      const currentEvolutionIndex = evolutionChain.findIndex(
        (evolution: { name: string; id: number }) => evolution.name === name
      );

      if (currentEvolutionIndex === -1) {
        return Promise.resolve([""]);
      }

      if (
        evolutionChain[currentEvolutionIndex] &&
        evolutionChain[currentEvolutionIndex + 1]
      ) {
        return Promise.resolve(
          evolutionChain
            .slice(currentEvolutionIndex + 1)
            .map((evolution: { name: string }) => evolution.name)
        );
      }
    } catch (error) {
      console.error("Error fetching Pokémon:", error);
      Promise.reject(error);
    }

    return Promise.resolve([""]);
  }

  getName(): string {
    return this.name;
  }

  getTypesString(): string[] {
    return this.types;
  }

  getTypes(): string {
    return this.types.join(", ");
  }

  getWeight(): number {
    return this.weight;
  }

  getHeight(): number {
    return this.height;
  }

  getOrder(): number {
    return this.order;
  }

  async getEvolutions(): Promise<string[]> {
    return await this.getAllNextEvolutions(this.name);
  }

  async getNextEvolutionName(): Promise<string> {
    return await this.getNextEvolution(this.name);
  }
}
