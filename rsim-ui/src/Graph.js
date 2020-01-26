import React from 'react';

import GridLayout from 'react-grid-layout';
import '../node_modules/react-vis/dist/style.css';
import '../node_modules/react-grid-layout/css/styles.css';
import '../node_modules/react-resizable/css/styles.css';
import {XYPlot, VerticalGridLines, HorizontalGridLines, XAxis, YAxis, LineSeries, RadarChart} from 'react-vis';
import Derivative from './Derivative';

const Results = props =>  {

    const d1 = props.data;
    const d2 = props.data2;
    const d1_ = Derivative(d1);
    const d2_ = Derivative(d2);
    const d1__ = Derivative(d1_);
    const d2__ = Derivative(d2_);

    const layout = [
      {i: 'a', x: 0, y: 0, w: 3, h: 1, static: true},
      {i: 'b', x: 0, y: 1, w: 3, h: 1, static: true},
      {i: 'c', x: 0, y: 2, w: 3, h: 1, static: true},
      {i: 'd', x: 1, y: 3, w: 1, h: 1.3, static: true}
    ];

    console.log(d1);

    let altY = [];
    if(d1 !== undefined) {
      for(var i = 0; i < d1.length; i++) {
        altY.push(d1[i].y);
      }
    }

    let velY = [];
    if(d1_ !== undefined) {
      for(var i = 0; i < d1_.length; i++) {
        velY.push(d1_[i].y);
      }
    }

    let accY = [];
    if(d1__ !== undefined) {
      for(var i = 0; i < d1__.length; i++) {
        accY.push(d1__[i].y);
      }
    }

    if(accY.length > 1) {
      var sum = 0;
      for( var i = 0; i < accY.find(element => element = Math.max(...accY)); i++ ){
          sum += accY[i];
      }
      var accAvg = sum/accY.length;
    }

    if(velY.length > 1) {
      sum = 0;
      for( var i = 0; i < velY.find(element => element = Math.max(...velY)); i++ ){
          sum += velY[i];
      }
      var velAvg = sum/velY.length;
    }


    var DATA = [{
        maxAccel: Math.max(...accY),
        maxVel: Math.max(...altY),
        AvgAccel: accAvg,
        AvgVel: velAvg,
        maxAlt: Math.max(...altY),
        massTot: (props.inputs[0].inputs[2].value +
                  props.inputs[1].inputs[3].value +
                  props.inputs[2].inputs[1].value +
                  props.inputs[3].inputs[1].value +
                  props.inputs[4].inputs[1].value)
      }];

      console.log(DATA);

    return (
      <div>
        {(d1 || d2) && <GridLayout className="layout" layout={layout} cols={3} rowHeight={300} width={window.innerWidth} height={window.innerHeight}>
          <div key="a" className="Results">
            <XYPlot
              className="plot"
              height={(layout[0]["h"] * 300) - 40}
              width={(window.innerWidth/2) * layout[0]["w"] - 30}
            >
              <VerticalGridLines />
              <HorizontalGridLines />
              <XAxis title="Time (s)"/>
              <YAxis title="Altitude"/>
              <LineSeries data={d1} />
              <LineSeries data={d2} />
            </XYPlot>
          </div>
          <div key="b" className="Results">
            <XYPlot
              className="plot"
              height={(layout[0]["h"] * 300) - 40}
              width={(window.innerWidth/2) * layout[0]["w"] - 30}
            >
              <VerticalGridLines />
              <HorizontalGridLines />
              <XAxis title="Time (s)"/>
              <YAxis title="Velocity"/>
              <LineSeries data={d1_} />
              <LineSeries data={d2_} />
            </XYPlot>
          </div>
          <div key="c" className="Results">
            <XYPlot
              className="plot"
              height={(layout[0]["h"] * 300) - 40}
              width={(window.innerWidth/2) * layout[0]["w"] - 30}>
              <VerticalGridLines />
              <HorizontalGridLines />
              <XAxis title="Time (s)"/>
              <YAxis title="Acceleration"/>
              <LineSeries data={d1__} />
              <LineSeries data={d2__} />
            </XYPlot>
          </div>
          <div key="d" className="Results">
            <RadarChart data={DATA} domains={[
              {name: 'maxAccel', domain: [0, 80], getValue: d => d.maxAccel},
              {name: 'maxVel', domain: [6.9, 1000], getValue: d => d.maxVel},
              {name: 'AvgAccel', domain: [0, 5], getValue: d => d.AvgAccel},
              {name: 'AvgVel', domain: [0, 0.002], getValue: d => d.AvgVel},
              {name: 'maxAlt', domain: [0, 3000], getValue: d => d.maxAlt},
              {name: 'massTot', domain: [0, 5], getValue: d => d.massTot}
            ]}
              height={400}
              width={400}
              style={{
              axes: {
                line: {},
                ticks: {},
                text: {}
              },
              labels: {
                fontSize: 10
              },
              polygons: {
                strokeWidth: 0.5,
                strokeOpacity: 1,
                fillOpacity: 0.1
              }
            }}/>
          </div>
        </GridLayout>}
      </div>
    )
};

export default Results;
