import React from "react";
import { emphasize, makeStyles, useTheme } from "@material-ui/core";
// import clsx from "clsx";
// import Select from "react-select";
import deburr from "lodash/deburr";
import Downshift from "downshift";
import { TextField, Popper, Paper, MenuItem, Chip } from "@material-ui/core";
import PropTypes from "prop-types";
// import CancelIcon from "@material-ui/icons/Cancel";
// import { Notice, KTCodeExample } from "../../_metronic/_partials/controls";

let suggestions  = [];

function renderInput(inputProps) {
  const { InputProps, classes, ref, ...other } = inputProps;

  return (
    <TextField
      InputProps={{
        inputRef: ref,
        classes: {
          root: classes.inputRoot,
          input: classes.inputInput,
        },
        ...InputProps,
      }}
      {...other}
    />
  );
}

function renderSuggestion(suggestionProps) {
  const {
    suggestion,
    index,
    itemProps,
    highlightedIndex,
    selectedItem,
  } = suggestionProps;
  const isHighlighted = highlightedIndex === index;
  const isSelected = (selectedItem || "").indexOf(suggestion.label) > -1;

  return (
    <MenuItem
      {...itemProps}
      key={`suggestion1${suggestion.label}`}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400,
      }}
    >
      {suggestion.label}
    </MenuItem>
  );
}

renderSuggestion.propTypes = {
  highlightedIndex: PropTypes.number,
  index: PropTypes.number,
  itemProps: PropTypes.object,
  selectedItem: PropTypes.string,
  suggestion: PropTypes.shape({ label: PropTypes.string }).isRequired,
};

function getSuggestions(value, { showEmpty = false } = {}) {
  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0 && !showEmpty
    ? []
    : suggestions.filter((suggestion) => {
        const keep =
          count < 5 &&
          suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;

        if (keep) {
          count += 1;
        }

        return keep;
      });
}



function DownshiftMultiple(props) {
  const { classes } = props;
  const [inputValue, setInputValue] = React.useState("");
  const [selectedItem, setSelectedItem] = React.useState([]);

  function handleKeyDown(event) {
    if (
      selectedItem.length &&
      !inputValue.length &&
      event.key === "Backspace"
    ) {
      setSelectedItem(selectedItem.slice(0, selectedItem.length - 1));
    }
  }

  function handleInputChange(event) {
    setInputValue(event.target.value);
  }

  function handleChange(item) {
    let newSelectedItem = [...selectedItem];
    if (newSelectedItem.indexOf(item) === -1) {
      newSelectedItem = [...newSelectedItem, item];
    }
    setInputValue("");
    setSelectedItem(newSelectedItem);
  }

  const handleDelete = (item) => () => {
    const newSelectedItem = [...selectedItem];
    newSelectedItem.splice(newSelectedItem.indexOf(item), 1);
    setSelectedItem(newSelectedItem);
  };

  return (
    <Downshift
      id="downshift-multiple"
      inputValue={inputValue}
      onChange={handleChange}
      selectedItem={selectedItem}
    >
      {({
        getInputProps,
        getItemProps,
        getLabelProps,
        isOpen,
        inputValue: inputValue2,
        selectedItem: selectedItem2,
        highlightedIndex,
      }) => {
        const { onBlur, onChange, onFocus, ...inputProps } = getInputProps({
          onKeyDown: handleKeyDown,
          placeholder: "Select multiple countries",
        });

        return (
          <div className={classes.container}>
            {renderInput({
              fullWidth: true,
              classes,
              label: "Countries",
              InputLabelProps: getLabelProps(),
              InputProps: {
                startAdornment: selectedItem.map((item) => (
                  <Chip
                    key={item}
                    tabIndex={-1}
                    label={item}
                    className={classes.chip}
                    onDelete={handleDelete(item)}
                  />
                )),
                onBlur,
                onChange: (event) => {
                  handleInputChange(event);
                  onChange(event);
                },
                onFocus,
              },
              inputProps,
            })}

            {isOpen ? (
              <Paper className={classes.paper} square>
                {getSuggestions(inputValue2).map((suggestion, index) =>
                  renderSuggestion({
                    suggestion,
                    index,
                    itemProps: getItemProps({ item: suggestion.label }),
                    highlightedIndex,
                    selectedItem: selectedItem2,
                  })
                )}
              </Paper>
            ) : null}
          </div>
        );
      }}
    </Downshift>
  );
}

DownshiftMultiple.propTypes = {
  classes: PropTypes.object.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: 250,
  },
  container: {
    flexGrow: 1,
    position: "relative",
  },
  paper: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
  },
  chip: {
    margin: theme.spacing(0.5, 0.25),
  },
  inputRoot: {
    flexWrap: "wrap",
    borderBottom: "none"
  },
  inputInput: {
    width: "auto",
    flexGrow: 1,
    border: "1px solid lightgray",
    height: 25,
    borderRadius: 6,
   
  },
  divider: {
    height: theme.spacing(2),
  },
  label: {
      fontSize: "20px",
  }
}));

export default function Autocomplete(props) {
  const classes = useStyles();

  //const classes2 = useStyles2();
  const theme = useTheme();
  const [single, setSingle] = React.useState(null);
  const [multi, setMulti] = React.useState(null);

  if(props.suggestions) {
  for(let i=0; i<props.suggestions.length; i++) {
      suggestions.push({label : props.suggestions[i]})
  } 

  }
//   function handleChangeSingle(value) {
//     setSingle(value);
//   }

//   function handleChangeMulti(value) {
//     setMulti(value);
//   }

//   const selectStyles = {
//     input: (base) => ({
//       ...base,
//       color: theme.palette.text.primary,
//       "& input": {
//         font: "inherit",
//       },
//     }),
//   };

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          {/* <KTCodeExample
           jsCode={jsCode1}
            beforeCodeTitle="Downshift"
            codeBlockHeight="400px"
          > */}

          <Downshift id="downshift-simple">
            {({
              getInputProps,
              getItemProps,
              getLabelProps,
              getMenuProps,
              highlightedIndex,
              inputValue,
              isOpen,
              selectedItem,
            }) => {
              const { onBlur, onFocus, ...inputProps } = getInputProps({
                placeholder: "Start Typing...",
              });

              return (
                <div className={classes.container}>
                  {renderInput({
                    fullWidth: true,
                    classes,
                    //label: "Service Deployed *",
                    InputLabelProps: getLabelProps({ shrink: true }),
                    InputProps: { onBlur, onFocus },
                    
                    inputProps,
                  })}

                  <div {...getMenuProps()}>
                    {isOpen ? (
                      <Paper className={classes.paper} square>
                        {getSuggestions(inputValue).map((suggestion, index) =>
                          renderSuggestion({
                            suggestion,
                            index,
                            itemProps: getItemProps({
                              item: suggestion.label,
                            }),
                            highlightedIndex,
                            selectedItem,
                          })
                        )}
                      </Paper>
                    ) : null}
                  </div>
                </div>
              );
            }}
          </Downshift>
        </div>
        {/* </KTCodeExample> */}
      </div>
    </>
  );
}
