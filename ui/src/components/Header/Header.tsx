import {
  Grid2 as Grid,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import Filters from "../Filters/Filters";
import { ReactComponent as PokemonIcon } from "../../assets/pokemon.svg";
import { ReactComponent as TrainerIcon } from "../../assets/trainer.svg";
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
interface HeaderProps {
  types?: string[];
  locations?: {
    name: string;
    id: string;
  }[];
  filterType?: string;
  setFilterType?: React.Dispatch<React.SetStateAction<string>>;
  filterLocation?: string;
  setFilterLocation?: React.Dispatch<React.SetStateAction<string>>;
  filterWeight?: string;
  setFilterWeight?: React.Dispatch<React.SetStateAction<string>>;
  filterHeight?: string;
  setFilterHeight?: React.Dispatch<React.SetStateAction<string>>;
  resetFilters?: (filter: string) => void;
  hideFilters?: boolean;
  children?: JSX.Element;
}

const Header = ({
  filterHeight,
  filterLocation,
  filterType,
  filterWeight,
  locations,
  setFilterHeight,
  setFilterLocation,
  setFilterType,
  setFilterWeight,
  types,
  resetFilters,
  hideFilters = true,
  children,
}: HeaderProps) => {
  const locationOptions = locations?.map((location) => {
    return { value: location.id, label: location.name };
  });
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  return (
    <Grid container size={12} flexDirection={isXs ? "column" : "row"}>
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
        {!hideFilters && resetFilters && (
          <>
            <Filters
              label={"types"}
              options={types!}
              value={filterType!}
              valueSetter={setFilterType!}
              resetFilters={() => resetFilters("types")}
            />
            <Filters
              label={"locations"}
              options={locationOptions!}
              value={filterLocation!}
              valueSetter={setFilterLocation!}
              resetFilters={() => resetFilters("locations")}
            />
            <Filters
              label={"weight"}
              options={WEIGHTS}
              value={filterWeight!}
              valueSetter={setFilterWeight!}
              resetFilters={() => resetFilters("weight")}
            />
            <Filters
              label={"height"}
              options={HEIGHTS}
              value={filterHeight!}
              valueSetter={setFilterHeight!}
              resetFilters={() => resetFilters("height")}
            />
          </>
        )}
        {children}
      </Grid>
    </Grid>
  );
};

export default Header;
