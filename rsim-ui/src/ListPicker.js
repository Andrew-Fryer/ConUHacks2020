import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
  },
}));

const ListPicker = props => {
  const classes = useStyles();

  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  React.useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  const setValue = value => {
      props.setInput({
          ...props,
          value,
      })
  };

  const handleChange = event => {
    setValue(event.target.value);
    event.preventDefault(); // I don't think this does anything
  };

  return (
    <div style={{
      textAlign: "left",
    }}>
      <FormControl variant="filled" className={classes.formControl}>
        <InputLabel ref={inputLabel}>
          {props.name}
        </InputLabel>
        <Select
          value={props.value}
          onChange={handleChange}
          labelWidth={labelWidth}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {["aluminum", "abs", "wood", "cardboard"].map(option => 
            <MenuItem key={option} value={option}>{option}</MenuItem>
          )}
        </Select>
      </FormControl>
    </div>
  );
}

export default ListPicker;
