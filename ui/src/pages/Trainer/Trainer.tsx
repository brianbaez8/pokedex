import { Filters, PokemonCard, PokemonLoading } from "../../components";
import {
  Grid2 as Grid,
  IconButton,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import { Pokemon } from "../../common/classes/Pokemon/Pokemon";
import { PokemonDef } from "../../common/types";
import { ReactComponent as PokemonIcon } from "../../assets/pokemon.svg";
import { getPokemonById } from "../../api";
import { useNavigate } from "react-router-dom";
import usePokemons from "../../hooks/usePokemons";

const sortOptions = ["A-Z", "Z-A"];

const fetchPokemonDetails = async (
  pokemonIds: string[],
  setPokemons: React.Dispatch<React.SetStateAction<any>>
) => {
  const pokemons: PokemonDef.Pokemon[] = [];
  try {
    for (const pokemonId of pokemonIds) {
      const { data } = await getPokemonById(pokemonId);
      if (data) {
        pokemons.push(new Pokemon(data));
      }
    }
    setPokemons(pokemons);
  } catch (error) {
    console.error(error);
  }
};

const Trainer = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>("A-Z");
  const {
    capturedPokemons: capturedPokemonsIds,
    encounteredPokemons: encounteredPokemonsIds,
  } = usePokemons();
  const navigate = useNavigate();

  const [capturedPokemons, setCapturedPokemons] = useState<
    PokemonDef.Pokemon[]
  >([]);

  const [encounteredPokemons, setEncounteredPokemons] = useState<
    PokemonDef.Pokemon[]
  >([]);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      fetchPokemonDetails(capturedPokemonsIds, setCapturedPokemons),
      fetchPokemonDetails(encounteredPokemonsIds, setEncounteredPokemons),
    ]);
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [capturedPokemonsIds, encounteredPokemonsIds]);

  const handleOnChange = (event: SelectChangeEvent) => {
    const newValue = event.target.value as string;

    if (newValue === "A-Z") {
      setSortBy("A-Z");
      setCapturedPokemons((prev) =>
        prev.sort((a, b) => a.name.localeCompare(b.name))
      );
      setEncounteredPokemons((prev) =>
        prev.sort((a, b) => a.name.localeCompare(b.name))
      );
    } else {
      setSortBy("Z-A");
      setCapturedPokemons((prev) =>
        prev.sort((a, b) => b.name.localeCompare(a.name))
      );
      setEncounteredPokemons((prev) =>
        prev.sort((a, b) => b.name.localeCompare(a.name))
      );
    }
  };

  return isLoading ? (
    <PokemonLoading />
  ) : (
    <Grid container paddingX={5} py={2}>
      <Grid container size={12} flexDirection={"column"}>
        <Grid container size={12}>
          <Grid
            alignItems={"center"}
            justifyContent={"flex-start"}
            container
            my={2}
            paddingX={5}
            columnGap={2}
            flex={1}
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
            <Filters
              label={"Sort By"}
              options={sortOptions}
              value={sortBy}
              valueSetter={setSortBy}
              onChange={handleOnChange}
            />
          </Grid>
        </Grid>

        <Grid container>
          <Grid container flexDirection={"column"} flex={1}>
            <Typography variant="h4">{"Encountered Pokemons"}</Typography>
            {encounteredPokemons?.length > 0 ? (
              encounteredPokemons.map((pokemon) => (
                <Grid container my={2} flexDirection={"column"}>
                  <PokemonCard hideActions pokemon={pokemon} height={150} />
                </Grid>
              ))
            ) : (
              <Typography variant="h6">{"No Pokemons Encountered"}</Typography>
            )}
            <Grid container my={2} flexDirection={"column"}></Grid>
          </Grid>

          <Grid container flexDirection={"column"} flex={1}>
            <Typography variant="h4">{"Capture Pokemons"}</Typography>

            {capturedPokemons.length > 0 ? (
              capturedPokemons.map((pokemon) => (
                <Grid container my={2} flexDirection={"column"}>
                  <PokemonCard hideActions pokemon={pokemon} height={140} />
                </Grid>
              ))
            ) : (
              <Typography variant="h6">{"No Pokemons Captured"}</Typography>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Trainer;
