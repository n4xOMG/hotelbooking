import React from "react";
import * as Icons from "@mui/icons-material";
import { MenuItem } from "@mui/material";
export  const IconMenuItem = React.memo(({ index, style, data, onSelect }) => {
  const option = data[index];
  return (
    <MenuItem key={option.value} value={option.value} style={style} onClick={() => onSelect(option.value)}>
      {React.createElement(Icons[option.value])}
      {option.label}
    </MenuItem>
  );
});
