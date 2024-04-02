import React from "react";
import Checkbox from "@mui/material/Checkbox";
import InputLabel from "@mui/material/InputLabel";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    formControl: {
      marginTop: 30,
      marginRight: 20,
      width: '40%',
      float: "right"
    },
    indeterminateColor: {
      color: "#f50057"
    },
    selectAllText: {
      fontWeight: 500
    },
    selectedAll: {
      backgroundColor: "rgba(0, 0, 0, 0.08)",
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.08)"
      }
    }
  }));
  
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 1;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250
      }
    },
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "center"
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "center"
    },
    variant: "menu"
};

function CheckableMultiSelect(props) {
    const { options, onChange, selected } = props
    const classes = useStyles();
    // const [selected, setSelected] = useState([]);
    const isAllSelected =
        options.length > 0 && selected.length === options.length;

    const handleChange = (event) => {
        const value = event.target.value;
        if (value[value.length - 1] === "all") {
            onChange(selected.length === options.length ? [] : options);
        return;
        }
        onChange(value);
    };

    return (
        <FormControl className={classes.formControl} variant="outlined" >
            <InputLabel htmlFor="mutiple-select-label">Select columns</InputLabel>
            <Select
                multiple
                value={selected}
                onChange={handleChange}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
                label="Select columns"
                size="normal"
            >
                <MenuItem
                value="all"
                classes={{
                    root: isAllSelected ? classes.selectedAll : ""
                }}
                >
                <ListItemIcon>
                    <Checkbox
                    classes={{ indeterminate: classes.indeterminateColor }}
                    checked={isAllSelected}
                    indeterminate={
                        selected.length > 0 && selected.length < options.length
                    }
                    />
                </ListItemIcon>
                <ListItemText
                    classes={{ primary: classes.selectAllText }}
                    primary="Select All"
                />
                </MenuItem>
                {options.map((option) => (
                <MenuItem key={option} value={option}>
                    <ListItemIcon>
                    <Checkbox checked={selected.indexOf(option) > -1} />
                    </ListItemIcon>
                    <ListItemText primary={option} />
                </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

export default CheckableMultiSelect;
