import React from 'react';
import './App.css';

import InputFactors from "./InputFactors";
import { createMuiTheme, CssBaseline, Box, Grid, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import GridLayout from 'react-grid-layout';
import '../node_modules/react-vis/dist/style.css';
import '../node_modules/react-grid-layout/css/styles.css';
import '../node_modules/react-resizable/css/styles.css';
import CSVReader from "react-csv-reader";
import Graph from "./Graph";
import SimpleAppBar from "./SimpleAppBar"

const theme = createMuiTheme()

const inputsStructure_manual = [
  {
    header: "body",
    title: "Body",
    inputs: [
      {
        name: "diameter",
        step: 0.1,
        max: 1,
      },
      {
        name: "length",
        step: 1,
        max: 10,
      },
      {
        name: "mass",
        step: 0.1,
        max: 1,
      },
      {
        name: "material",
      },
    ],
  },
  {
    header: "fins",
    title: "Fins",
    inputs: [
      {
        name: "cant",
      },
      {
        name: "count",
        step: 1,
        max: 10,
      },
      {
        name: "height",
        step: 0.1,
        max: 1,
      },
      {
        name: "mass",
        step: 0.1,
        max: 1,
      },
      {
        name: "sweep",
      },
      {
        name: "material",
      },
    ],
  },
  {
    header: "variableMass",
    title: "Variable Mass",
    inputs: [
      {
        name: "distanceFromTip",
        step: 0.1,
        max: 1,
      },
      {
        name: "mass",
        step: 0.1,
        max: 1,
      },
    ],
  },
  {
    header: "motor",
    title: "Motor",
    inputs: [
      {
        name: "impulse",
        step: 5,
        max: 50,
      },
      {
        name: "mass",
        step: 0.1,
        max: 1,
      },
      {
        name: "burnTime",
        step: 2,
        max: 20,
      },
    ],
  },
  {
    header: "noseCone",
    title: "Nose Cone",
    inputs: [
      {
        name: "length",
        step: 0.1,
        max: 1,
      },
      {
        name: "mass",
        step: 0.1,
        max: 1,
      },
      {
        name: "material",
      },
    ],
  },
];

const inputsStructure_preFilled = [{"className":"body","header":"body","title":"Body","inputs":[{"name":"diameter","step":0.1,"max":1,"value":0.5},{"name":"length","step":1,"max":10,"value":5},{"name":"mass","step":0.1,"max":1,"value":0.5},{"name":"material","value":"aluminum"}]},{"className":"fins","header":"fins","title":"Fins","inputs":[{"name":"cant","value":60},{"name":"count","step":1,"max":10,"value":6},{"name":"height","step":0.1,"max":1,"value":0.6},{"name":"mass","step":0.1,"max":1,"value":0.6},{"name":"sweep","value":60},{"name":"material","value":"aluminum"}]},{"className":"variableMass","header":"variableMass","title":"Variable Mass","inputs":[{"name":"distanceFromTip","step":0.1,"max":1,"value":0.5},{"name":"mass","step":0.1,"max":1,"value":0.5}]},{"className":"motor","header":"motor","title":"Motor","inputs":[{"name":"impulse","step":5,"max":50,"value":25},{"name":"mass","step":0.1,"max":1,"value":0.5},{"name":"burnTime","step":2,"max":20,"value":8}]},{"className":"noseCone","header":"noseCone","title":"Nose Cone","inputs":[{"name":"length","step":0.1,"max":1,"value":0.6},{"name":"mass","step":0.1,"max":1,"value":0.6},{"name":"material","value":"aluminum"}]}];

const useStyles = makeStyles({
  flex: {
    display: 'flex',
    flexWrap: 'wrap',
    alignContent: 'stretch',
  }, input: {
    padding: theme.spacing(2),
    aligntContent: 'center'
  }
})

const reformatRes = res => res.map(dataPoint => ({
  x: dataPoint[0],
  y: dataPoint[1],
}));

const simulate = (state, setResults) => {
  // error checking:
  // if(false) {
  //   alert("Uh oh!\nThere seems to be a problem with your input data!");
  // }

  // build object to send to server:
  const inputData = {};
  for (const factor of state) {
    const inputs = {};
    for (const input of factor.inputs) {
      inputs[input.name] = input.value;
    }
    inputData[factor.header] = inputs;
  }

  // send to server to simulate
  fetch(process.env.BACKEND_HOST || "http://localhost:5000/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inputData),
  })
    .then(res => res.json())
    .then(res => {
      console.log(res);
      setResults(reformatRes(res));
    })
    .catch(err => {
      alert("Uh oh!\nIt looks like you are missing an input!");
    });
  console.log("\n\n\n\n\n\n");
  console.log(JSON.state);
};

export default function App() {
  const classes = useStyles();

  const layout = [
    { i: 'body', x: 0, y: 0, w: 1, h: 1, static: true },
    { i: 'fins', x: 1, y: 0, w: 1, h: 2, static: true },
    { i: 'variableMass', x: 2, y: 0, w: 1, h: 1, static: true },
    { i: 'motor', x: 0, y: 1, w: 1, h: 1, static: true },
    { i: 'noseCone', x: 2, y: 0, w: 1, h: 1, static: true }
  ];
  const [state, setState] = React.useState(inputsStructure_preFilled);
  const setInputFactor = factor => {
    const newState = [
      ...state,
    ];
    for (const factI in newState) {
      if (newState[factI].header === factor.header) {
        newState[factI] = factor;
      }
    }
    setState(newState);
  };
  console.log("state:");
  console.log(state);

  const [results, setResults] = React.useState(undefined);
  const [results2, setResults2] = React.useState(undefined);

  const inputData = {};
  for(const factor of state) {
    const inputs = {};
    for(const input of factor.inputs) {
      inputs[input.name] = input.value;
    }
    inputData[factor.header] = inputs;
  }

  return (
    <>
      <CssBaseline />
      <SimpleAppBar />
      <div className={classes.flex}>
        {
          state.map(structure =>
            <InputFactors
              key={structure.header}
              setInputFactor={setInputFactor}
              {...structure}
            />
          )
        }
      </div>
        <Box p={2}>
          <Button
            color="secondary"
            variant="contained"
            onClick={() => simulate(state, setResults)}
          >
            Simulate!
          </Button>
        </Box>
        <Box p={2}>
          <CSVReader onFileLoaded={data => setResults2(data.map(row => ({
            x: row[0],
            y: row[1],
          })))} />
        </Box>
      <Box p={2}>
        <Graph data={results} data2={results2} inputs={state}/>
      </Box>
    </>
  );
};
