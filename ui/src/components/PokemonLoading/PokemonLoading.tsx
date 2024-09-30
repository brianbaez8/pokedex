import "./PokemonLoading.css";

import { Grid2 as Grid } from "@mui/material";

const PokemonLoading = () => {
    return (
        <Grid container height={"100vh"} alignItems={"center"} justifyContent={"center"}>
            <img className="loader" src={'/pokeball.png'} alt={'pokeball-loader'} width={150}/>
        </Grid>
    )
}

export default PokemonLoading;