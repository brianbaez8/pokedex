import "./PokemonDetails.css";

import {
  Box,
  Chip,
  Grid2 as Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import { Header, PokemonLoading } from "../../components";
import React, { useEffect, useState } from "react";

import { ReactComponent as PokeballIcon } from "../../assets/pokeball.svg";
import { Pokemon } from "../../common/classes/Pokemon/Pokemon";
import { PokemonDef } from "../../common/types";
import { capitalize } from "../../utils";
import { getPokemonById } from "../../api";
import { useParams } from "react-router-dom";
import usePokemons from "../../hooks/usePokemons";

const fetchPokemon = async (
  id: string,
  setPokemon: React.Dispatch<React.SetStateAction<any>>,
  setEvolutions: React.Dispatch<React.SetStateAction<PokemonDef.Pokemon[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const evolutions: PokemonDef.Pokemon[] = [];
  setIsLoading(true);
  try {
    const { data } = await getPokemonById(id);
    if (data) {
      const pokemon = new Pokemon(data);
      setPokemon(pokemon);
      if (pokemon?.evolutionChain) {
        for (const evolution of pokemon.evolutionChain) {
          const { data } = await getPokemonById(`${evolution.id}`);
          if (data) {
            evolutions.push(new Pokemon(data));
          }
        }
      }
    }
    setEvolutions(evolutions);
    setIsLoading(false);
  } catch (error) {
    console.error(error);
  }
  setIsLoading(false);
};

const PokemonDetails = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [pokemon, setPokemon] = useState<PokemonDef.Pokemon>();
  const [evolutions, setEvolutions] = useState<PokemonDef.Pokemon[]>([]);
  const { id } = useParams();
  const { capturedPokemons, setEncounteredPokemon } = usePokemons();
  const pokemonIsCapture = capturedPokemons.includes(id || "");

  useEffect(() => {
    if (id) {
      fetchPokemon(id, setPokemon, setEvolutions, setIsLoading);

      setEncounteredPokemon(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCapturePokemon = () => {
    if (pokemon) {
      try {
        localStorage.setItem(
          "capturedPokemons",
          JSON.stringify([
            ...JSON.parse(localStorage.getItem("capturedPokemons") || "[]"),
            String(pokemon.id),
          ])
        );

        localStorage.setItem(
          "encounteredPokemons",
          JSON.stringify(
            JSON.parse(
              localStorage.getItem("encounteredPokemons") || "[]"
            ).filter(
              (encounteredPokemonId: string) => encounteredPokemonId !== id
            )
          )
        );

        alert(`You captured ${capitalize(pokemon.name)}`);
        window.dispatchEvent(new Event("pokemonInteraction"));
      } catch (error) {
        console.error(error);
      }
    }
  };
  return isLoading ? (
    <PokemonLoading />
  ) : pokemon ? (
    <Grid container paddingX={5} py={2}>
      <Grid size={12}>
        <Header />

        <Grid container flexDirection={"column"} alignItems={"center"}>
          {/* NAME */}
          {pokemonIsCapture ? (
            <Typography variant="h4">{`You have captured ${capitalize(
              pokemon.name
            )}`}</Typography>
          ) : (
            <Typography variant="h4">{`A wild ${capitalize(
              pokemon.name
            )} has appeared`}</Typography>
          )}

          {/* CAPTURE */}
          {!pokemonIsCapture && (
            <Grid container alignItems={"center"} spacing={1}>
              <Typography variant="h6">Capture?</Typography>
              <Tooltip title="Capture Pokemon">
                <IconButton onClick={handleCapturePokemon}>
                  <PokeballIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          )}

          {/* POKEMON IMAGE AND EVOLUTIONS */}
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            border={1}
            borderRadius={8}
            padding={2}
            marginTop={2}
            width="100%"
            maxWidth="450px"
          >
            <img
              src={pokemon.sprites}
              alt={pokemon.name}
              style={{ width: "100%", height: "auto", borderRadius: "8px" }}
            />
            <Grid container spacing={3} my={2}>
              {pokemon?.types.map((type) => (
                <Chip label={type} />
              ))}
            </Grid>

            <Grid container spacing={3} my={2}>
              <Chip label={`Weight: ${pokemon.weight}hg`} />
              <Chip label={`Height: ${pokemon.height}dm`} />
            </Grid>

            <Grid container spacing={3} my={2}>
              <Typography variant="h5">Locations</Typography>
              <Grid
                container
                spacing={0.5}
                justifyContent={"center"}
                width={"100%"}
              >
                {pokemon.locations?.map((location) => (
                  <Chip label={capitalize(location.replace("-", " "))} />
                ))}
              </Grid>
            </Grid>

            <Typography variant="h6" marginTop={2}>
              Evolutions
            </Typography>

            {/* TYPES */}

            <Box
              display="flex"
              flexDirection="row"
              justifyContent="center"
              marginTop={1}
            >
              {evolutions.map((evolution) => (
                <Box
                  key={evolution.name}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  marginX={1}
                >
                  <img
                    src={evolution.sprites}
                    alt={evolution.name}
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "8px",
                    }}
                  />
                  <Typography variant="body1">
                    {capitalize(evolution.name)}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  ) : null;
};

export default PokemonDetails;
