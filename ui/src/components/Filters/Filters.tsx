import {
  FormControl,
  Grid2 as Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  capitalize,
} from "@mui/material";

import { FilterQuery } from "../../common/types/api";

interface FiltersProps {
  value: string;
  valueSetter: React.Dispatch<React.SetStateAction<string>>;
  options: string[] | { value: string; label: string }[];
  label: string;
  onChange?: (event: SelectChangeEvent) => void;
  setCurrentFilter?: React.Dispatch<React.SetStateAction<string>>;
  currentFilter?: string;
  query?: FilterQuery;
  setQuery?: React.Dispatch<React.SetStateAction<FilterQuery>>;
}

type OptionObject = { value: string; label: string };

const Filters = ({
  label,
  options,
  value,
  valueSetter,
  onChange,
}: FiltersProps) => {
  const isArrayOfStrings = typeof options[0] === "string";
  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    valueSetter(value);
  };

  return (
    <Grid
      size={{
        sm: 2,
        xs: 12,
      }}
      style={{
        minWidth: "200px",
      }}
    >
      <FormControl fullWidth>
        <InputLabel id={`${label}-select`}>{capitalize(label)}</InputLabel>
        <Select
          labelId={`${label}-select`}
          id={`${label}-select`}
          value={value}
          label={label}
          onChange={onChange || handleChange}
        >
          <MenuItem key={-1} value={""}>
            {/*  */}
          </MenuItem>

          {isArrayOfStrings
            ? options.map((option) => (
                <MenuItem key={option as string} value={option as string}>
                  {capitalize(option as string)}
                </MenuItem>
              ))
            : options.map((option) => (
                <MenuItem
                  key={(option as OptionObject).value}
                  value={(option as OptionObject).value}
                >
                  {capitalize((option as OptionObject).label)}
                </MenuItem>
              ))}
        </Select>
      </FormControl>
    </Grid>
  );
};

export default Filters;
