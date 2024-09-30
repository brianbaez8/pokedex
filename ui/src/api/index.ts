import { FilterQuery } from "../common/types/api";
import axios from "axios";

export const getAllPokemons = async (query?: FilterQuery) => {
  const params = new URLSearchParams({
    limit: query?.limit?.toString() || "12",
    offset: query?.offset?.toString() || "0",
    type: query?.type || "",
    location: query?.location || "",
    height: query?.height?.toString() || "",
    weight: query?.weight?.toString() || "",
  });

  console.log("params", params.toString());

  return await axios.get(`/pokemons`, {
    params,
  });
};

export const getAllTypes = async () => {
  return await axios.get(`/pokemons/types`);
};

export const getPokemonById = async (id: string) => {
  return await axios.get(`/pokemons/${id}`);
};

export const getLocations = async () => {
  return await axios.get(`/pokemons/locations`);
};
