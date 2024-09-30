import { Request, Response, Router } from "express";

import PokemonService from "../services/pokemon";

const route = Router();

interface Body {
  name: string;
  type: string;
  pokedexNumber: number;
}

export default (app: Router) => {
  app.use("/pokemons", route);

  route.get("/", async (req, res: Response) => {
    const pokemons = await PokemonService.getPokemons(req);

    return res.status(200).json(pokemons);
  });

  route.get("/types", async (req: Request, res: Response) => {
    const types = await PokemonService.getTypes();
    return res.status(200).json(types);
  });

  route.get("/locations", async (req: Request, res: Response) => {
    const locations = await PokemonService.getLocations();
    return res.status(200).json(locations);
  });

  route.get("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const pokemon = await PokemonService.getPokemonById(id);
    return res.status(200).json(pokemon);
  });
};
