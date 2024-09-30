import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Grid2 as Grid,
  Typography,
} from "@mui/material";

import { PokemonDef } from "../common/types";
import { useNavigate } from "react-router-dom";

interface PokemonCardProps {
  pokemon: PokemonDef.Pokemon;
  hideActions?: boolean;
  height?: number;
}

const PokemonCard = ({ pokemon, hideActions, height }: PokemonCardProps) => {
  const navigate = useNavigate();
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{ height: height || 120 }}
        image={pokemon.sprites}
        title={pokemon.name}
        component={"img"}
        style={{ objectFit: "contain" }}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {pokemon.name}
        </Typography>

        <Grid container spacing={3} my={2}>
          {pokemon?.types.map((type) => (
            <Chip label={type} />
          ))}
        </Grid>

        <Grid container spacing={3} my={2}>
          <Chip label={`Weight: ${pokemon.weight}hg`} />
          <Chip label={`Height: ${pokemon.height}dm`} />
        </Grid>
      </CardContent>
      {!hideActions && (
        <CardActions>
          <Button
            size="small"
            onClick={() => navigate(`pokemons/${pokemon.id}`)}
          >
            See more
          </Button>
          <Button
            size="small"
            onClick={() => navigate(`pokemons/${pokemon.id}`)}
          >
            Encounter
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default PokemonCard;
