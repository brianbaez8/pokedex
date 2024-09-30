import { useEffect, useState } from "react";

const getPokemonsFromLocalStorage = async (
  setCapturedPokemons: React.Dispatch<React.SetStateAction<string[]>>,
  setEncounteredPokemons: React.Dispatch<React.SetStateAction<string[]>>
) => {
  try {
    const capturedPokemons = localStorage.getItem("capturedPokemons");
    const encounteredPokemons = localStorage.getItem("encounteredPokemons");
    if (capturedPokemons) {
      setCapturedPokemons(JSON.parse(capturedPokemons));
    }
    if (encounteredPokemons) {
      setEncounteredPokemons(JSON.parse(encounteredPokemons));
    }
    return [];
  } catch (error) {
    console.error(error);
  }
};

const usePokemons = () => {
  const [capturedPokemons, setCapturedPokemons] = useState<string[]>([]);
  const [encounteredPokemons, setEncounteredPokemons] = useState<string[]>([]);
  useEffect(() => {
    const handleCapturePokemon = () => {
      getPokemonsFromLocalStorage(setCapturedPokemons, setEncounteredPokemons);
    };

    getPokemonsFromLocalStorage(setCapturedPokemons, setEncounteredPokemons);

    window.addEventListener("pokemonInteraction", handleCapturePokemon);

    return () => {
      window.removeEventListener("pokemonInteraction", handleCapturePokemon);
    };
  }, []);

  const setEncounteredPokemon = (id: string) => {
    try {
      const encounteredPokemons = JSON.parse(
        localStorage.getItem("encounteredPokemons") || "[]"
      );

      if (encounteredPokemons.includes(id)) {
        return;
      }
      localStorage.setItem(
        "encounteredPokemons",
        JSON.stringify([...encounteredPokemons, id])
      );
    } catch (error) {
      console.error(error);
    }
  };

  return { capturedPokemons, encounteredPokemons, setEncounteredPokemon };
};

export default usePokemons;
