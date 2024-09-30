import { Grid2 as Grid, Pagination } from "@mui/material";
import { Header, PokemonCard, PokemonLoading } from "./components";
import React, { useEffect, useState } from "react";
import { getAllPokemons, getAllTypes, getLocations } from "./api";

import { FilterQuery } from "./common/types/api";
import { PokemonDef } from "./common/types";

const fetchPokemons = async (
  query: FilterQuery,
  setPokemons: React.Dispatch<React.SetStateAction<PokemonDef.Pokemon[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setPageCount: React.Dispatch<React.SetStateAction<number>>
) => {
  setLoading(true);
  try {
    const { data } = await getAllPokemons(query);
    if (data) {
      setPageCount(Math.ceil(data.count / query.limit!));
      setPokemons(data.results);
    }
  } catch (error) {
    setLoading(false);
    console.error(error);
  }
  setLoading(false);
};

const fetchTypes = async (
  types: string[],
  setTypes: React.Dispatch<React.SetStateAction<string[]>>
) => {
  if (types.length > 0) return;
  try {
    const { data } = await getAllTypes();
    if (data) {
      setTypes(data);
    }
  } catch (error) {
    console.error(error);
  }
};

const fetchLocations = async (
  locations: {
    name: string;
    id: string;
  }[],
  setLocations: React.Dispatch<
    React.SetStateAction<
      {
        name: string;
        id: string;
      }[]
    >
  >
) => {
  if (locations.length > 0) return;
  try {
    const { data } = await getLocations();
    if (data) {
      setLocations(data);
    }
  } catch (error) {
    console.error(error);
  }
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("");
  const [filterLocation, setFilterLocation] = useState<string>("");
  const [filterWeight, setFilterWeight] = useState<string>("");
  const [filterHeight, setFilterHeight] = useState<string>("");
  const [query, setQuery] = useState<FilterQuery>({
    limit: 16,
    offset: 0,
    page: 1,
  });
  const [pokemon, setPokemons] = useState<PokemonDef.Pokemon[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [locations, setLocations] = useState<{ name: string; id: string }[]>(
    []
  );
  const [pageCount, setPageCount] = useState(20);

  const resetFilters = () => {
    setFilterType("");
    setFilterLocation("");
    setFilterWeight("");
    setFilterHeight("");
  };

  const handlePagination = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setQuery({
      ...query,
      page,
      offset: query.limit! * (page - 1),
      type: filterType,
    });
  };

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      fetchPokemons(query, setPokemons, setIsLoading, setPageCount),
      fetchTypes(types, setTypes),
      fetchLocations(locations, setLocations),
    ])
      .then(() => setIsLoading(false))
      .catch(() => setIsLoading(false));
  }, [query, types, locations]);

  useEffect(() => {
    setQuery({
      ...query,
      type: filterType,
      location: filterLocation,
      weight: filterWeight ? Number(filterWeight) : undefined,
      height: filterHeight ? Number(filterHeight) : undefined,
      offset: 0,
      page: 1,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType, filterLocation, filterHeight, filterWeight]);

  return isLoading ? (
    <PokemonLoading />
  ) : (
    <Grid container paddingX={5} py={2}>
      <Grid size={12}>
        <Header
          filterHeight={filterHeight}
          filterLocation={filterLocation}
          filterType={filterType}
          filterWeight={filterWeight}
          setFilterHeight={setFilterHeight}
          setFilterLocation={setFilterLocation}
          setFilterType={setFilterType}
          setFilterWeight={setFilterWeight}
          types={types}
          locations={locations}
          hideFilters={false}
          resetFilters={resetFilters}
        />

        <Grid container justifyContent={"center"} spacing={5}>
          {pokemon.map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))}
        </Grid>

        <Grid container justifyContent={"center"} paddingY={3}>
          <Pagination
            page={query.page}
            count={pageCount}
            onChange={handlePagination}
            color="primary"
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default App;
