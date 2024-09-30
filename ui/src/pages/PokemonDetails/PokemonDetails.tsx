import "./PokemonDetails.css";

import {
  Chip,
  Grid2 as Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ReactComponent as PokeballIcon } from "../../assets/pokeball.svg";
import { Pokemon } from "../../common/classes/Pokemon/Pokemon";
import { PokemonDef } from "../../common/types";
import { ReactComponent as PokemonIcon } from "../../assets/pokemon.svg";
import { PokemonLoading } from "../../components";
import { ReactComponent as TrainerIcon } from "../../assets/trainer.svg";
import { capitalize } from "../../utils";
import { getPokemonById } from "../../api";
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
  const navigate = useNavigate();
  const { capturedPokemons, encounteredPokemons, setEncounteredPokemon } =
    usePokemons();
  const pokemonIsCapture = capturedPokemons.includes(id || "");
  const pokemonIsEncountered = encounteredPokemons.includes(id || "");

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
            <Tooltip title="Trainer">
              <IconButton onClick={() => navigate("/trainer")}>
                <TrainerIcon fontSize={24} />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>

        <Grid container flexDirection={"column"}>
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
              <IconButton onClick={handleCapturePokemon}>
                <PokeballIcon />
              </IconButton>
            </Grid>
          )}

          {/* TYPES */}
          <Grid container spacing={3} my={2}>
            {pokemon?.types.map((type) => (
              <Chip label={type} />
            ))}
            <Chip label={`Weight: ${pokemon.weight}hg`} />
            <Chip label={`Height: ${pokemon.height}dm`} />
          </Grid>
        </Grid>

        <Grid container>
          <Grid className="pokemonImageContainer">
            <img
              className="pokemonImage"
              src={pokemon.sprites}
              alt={pokemon.name}
            />
          </Grid>

          <Grid>
            <Typography variant="h3">Evolutions</Typography>
            <Grid size={12}>
              <Grid className="pokemonEvolutionContainer">
                {evolutions.length > 0 ? (
                  evolutions.map((evolution) => (
                    <Grid
                      className="pokemonEvolution"
                      onClick={() => navigate(`/pokemons/${evolution.id}`)}
                    >
                      <Typography variant="body1">
                        {capitalize(evolution.name)}
                      </Typography>
                      <img
                        className="pokemonEvolutionImage"
                        src={evolution.sprites}
                        alt={evolution.name}
                      />
                    </Grid>
                  ))
                ) : (
                  <Typography variant="h4">No Evolutions</Typography>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  ) : null;
};

export default PokemonDetails;
