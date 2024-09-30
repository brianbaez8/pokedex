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
  { value: "25", label: "Up to 25hg" },
  { value: "50", label: "Up to 50hg" },
  { value: "75", label: "Up to 75hg" },
  { value: "100", label: "Up to 100hg" },
  { value: "150", label: "Up to 150hg" },
  { value: "300", label: "Up to 300hg" },
  { value: "600", label: "Up to 600hg" },
  { value: "1200", label: "Up to 1200hg" },
  { value: "1500", label: "Up to 1500hg" },
  { value: "2000", label: "Up to 2000hg" },
];

const HEIGHTS = [
  { value: "25", label: "Up to 25dm" },
  { value: "50", label: "Up to 50dm" },
  { value: "75", label: "Up to 75dm" },
  { value: "100", label: "Up to 100dm" },
  { value: "150", label: "Up to 150dm" },
  { value: "300", label: "Up to 300dm" },
  { value: "600", label: "Up to 600dm" },
  { value: "1200", label: "Up to 1200dm" },
  { value: "1500", label: "Up to 1500dm" },
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
  resetFilters?: () => void;
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
    return { value: location.name, label: location.name };
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
        <IconButton
          onClick={() => {
            navigate("/");
            if (resetFilters) {
              resetFilters();
            }
          }}
        >
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
        {!hideFilters && (
          <>
            <Filters
              label={"types"}
              options={types!}
              value={filterType!}
              valueSetter={setFilterType!}
            />
            <Filters
              label={"locations"}
              options={locationOptions!}
              value={filterLocation!}
              valueSetter={setFilterLocation!}
            />
            <Filters
              label={"weight"}
              options={WEIGHTS}
              value={filterWeight!}
              valueSetter={setFilterWeight!}
            />
            <Filters
              label={"height"}
              options={HEIGHTS}
              value={filterHeight!}
              valueSetter={setFilterHeight!}
            />
          </>
        )}
        {children}
      </Grid>
    </Grid>
  );
};

export default Header;
