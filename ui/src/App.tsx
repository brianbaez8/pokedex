import { Filters, PokemonCard, PokemonLoading } from "./components";
import { Grid2 as Grid, IconButton, Pagination, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getAllPokemons, getAllTypes, getLocations } from "./api";

import { FilterQuery } from "./common/types/api";
import { PokemonDef } from "./common/types";
import { ReactComponent as PokemonIcon } from "./assets/pokemon.svg";
import { ReactComponent as TrainerIcon } from "./assets/trainer.svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const WEIGHTS = [
  { value: "100", label: "Up to 100hg" },
  { value: "200", label: "Up to 200hg" },
  { value: "300", label: "Up to 300hg" },
  { value: "400", label: "Up to 400hg" },
  { value: "500", label: "Up to 500hg" },
  { value: "600", label: "Up to 600hg" },
  { value: "700", label: "Up to 700hg" },
  { value: "800", label: "Up to 800hg" },
  { value: "900", label: "Up to 900hg" },
  { value: "1000", label: "Up to 1000hg" },
  { value: "2000", label: "Up to 2000hg" },
];

const HEIGHTS = [
  { value: "100", label: "Up to 100dm" },
  { value: "200", label: "Up to 200dm" },
  { value: "300", label: "Up to 300dm" },
  { value: "400", label: "Up to 400dm" },
  { value: "500", label: "Up to 500dm" },
  { value: "600", label: "Up to 600dm" },
  { value: "700", label: "Up to 700dm" },
  { value: "800", label: "Up to 800dm" },
  { value: "900", label: "Up to 900dm" },
  { value: "1000", label: "Up to 1000dm" },
  { value: "2000", label: "Up to 2000dm" },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const healthCheckPing = async (
  setMessage: React.Dispatch<React.SetStateAction<string>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    const response = await axios.get("/_health");
    const message = response.data;
    setMessage(message);
  } catch (error) {
    setMessage(
      "Unable to check health of server. Please check that the server is started and that the proxy port matches the server port"
    );
  }
};

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
  const navigate = useNavigate();

  const resetFilters = (filter: string) => {
    switch (filter) {
      case "types":
        setFilterWeight("");
        setFilterHeight("");
        setFilterLocation("");
        break;
      case "locations":
        setFilterWeight("");
        setFilterHeight("");
        setFilterType("");
        break;
      case "weight":
        setFilterHeight("");
        setFilterLocation("");
        setFilterType("");
        break;
      case "height":
        setFilterWeight("");
        setFilterLocation("");
        setFilterType("");
        break;
      default:
        break;
    }
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
      weight: Number(filterWeight),
      height: Number(filterHeight),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType, filterLocation, filterHeight, filterWeight]);

  const locationOptions = locations.map((location) => {
    return { value: location.id, label: location.name };
  });

  return isLoading ? (
    <PokemonLoading />
  ) : (
    <Grid container paddingX={5} py={2}>
      <Grid size={12}>
        <Grid container size={12}>
          <Grid
            alignItems={"center"}
            justifyContent={"flex-start"}
            container
            my={2}
            paddingX={5}
            columnGap={2}
          >
            <IconButton onClick={() => navigate("/")}>
              <PokemonIcon />
            </IconButton>
          </Grid>
          <Grid
            alignItems={"center"}
            justifyContent={"flex-end"}
            container
            my={2}
            paddingX={5}
            columnGap={2}
            flex={1}
          >
            <Tooltip title="Trainer">
              <IconButton onClick={() => navigate("/trainer")}>
                <TrainerIcon fontSize={24} />
              </IconButton>
            </Tooltip>
            <Filters
              label={"types"}
              options={types}
              value={filterType}
              valueSetter={setFilterType}
              resetFilters={() => resetFilters("types")}
            />
            <Filters
              label={"locations"}
              options={locationOptions}
              value={filterLocation}
              valueSetter={setFilterLocation}
              resetFilters={() => resetFilters("locations")}
            />
            <Filters
              label={"weight"}
              options={WEIGHTS}
              value={filterWeight}
              valueSetter={setFilterWeight}
              resetFilters={() => resetFilters("weight")}
            />
            <Filters
              label={"height"}
              options={HEIGHTS}
              value={filterHeight}
              valueSetter={setFilterHeight}
              resetFilters={() => resetFilters("height")}
            />
          </Grid>
        </Grid>

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
