interface EvolutionChain {
  species: {
    name: string;
    url: string;
  };
  evolves_to: EvolutionChain[];
}

export const getEvolutionChainNames = (
  chain: EvolutionChain
): { name: string; id: number }[] => {
  const evolutionNames: { name: string; id: number }[] = [];

  // Helper function to recursively extract names from the chain
  function extractNames(evolution: EvolutionChain) {
    const splitted = evolution.species.url.split("/");
    evolutionNames.push({
      id: Number(splitted[splitted.length - 2]),
      name: evolution.species.name,
    });

    // Recursively go through all evolutions
    evolution.evolves_to.forEach((nextEvolution) => {
      extractNames(nextEvolution);
    });
  }

  extractNames(chain); // Start the recursion with the base chain

  return evolutionNames;
};
