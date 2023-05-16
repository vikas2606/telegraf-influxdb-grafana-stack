import React, { useState, useEffect } from "react";
import data from "./data/PDSCH.json";
import {
  VictoryAxis,
  VictoryTooltip,
  VictoryChart,
  VictoryGroup,
  VictoryScatter,
  VictoryZoomContainer,
  VictoryLegend
} from "victory";
import {
  XaxisProps,
  YaxisProps,
  chartStyles,
  color_dl,
  color_ul,
} from "./helpers/chartstyle";

const cellData = Object.entries(data.cells).map(([id, cell]) => ({
  id: parseInt(id),
  dl_sched_users_avg: [],
  ul_sched_users_avg: [],
  schedule: {
    dl_sched_users_avg: cell.schedule.dl_sched_users_avg,
    ul_sched_users_avg: cell.schedule.ul_sched_users_avg,
  },
}));

function PDSCHgraph({ isDarkTheme,timeRange }) {
  const [zoomaxis, setZoomaxis] = useState("null");
  const [checkboxX, setCheckboxX] = useState(false);
  const [checkboxY, setCheckboxY] = useState(false);
  const [visibility, setVisibility] = useState({ dl: {}, ul: {} });

  const toggleVisibility = (cellId, graphType) => {
    setVisibility((prevVisibleData) => {
      const graphVisibleData = prevVisibleData[graphType.toLowerCase()];
      return {
        ...prevVisibleData,
        [graphType.toLowerCase()]: {
          ...graphVisibleData,
          [cellId]: !graphVisibleData[cellId],
        },
      };
    });
    console.log(visibility);
  };

  useEffect(() => {
    setVisibility((prevVisibility) => {
      const updatedVisibility = {};
      Object.keys(prevVisibility).forEach((lineType) => {
        updatedVisibility[lineType] = {};
        Object.keys(data.cells).forEach((cellId) => {
          updatedVisibility[lineType][cellId] = true;
        });
      });
      return updatedVisibility;
    });
  }, []);


  useEffect(()=>{
    for (let i = 0; i < 20; i++) {
        cellData.forEach((cell) => {
          cell.dl_sched_users_avg.push({
            x: (Math.random()*2)-1,
            y: cell.schedule.dl_sched_users_avg + (Math.random()*2)-1,
            name: `Cell#${cell.id}_dl`,
          });
          cell.ul_sched_users_avg.push({
            x:  (Math.random()*2)-1,
            y: cell.schedule.ul_sched_users_avg + (Math.random()*2)-1,
            name: `Cell#${cell.id}_ul`,
          });
        });
      }
      console.log(cellData.dl_sched_users_avg)
  },[])

  

  const HandleCheckboxX = () => {
    setCheckboxX(!checkboxX);
  };
  const HandleCheckboxY = () => {
    setCheckboxY(!checkboxY);
  };

  useEffect(() => {
    if (checkboxX && checkboxY) {
      setZoomaxis("");
    } else if (checkboxX) {
      setZoomaxis("x");
    } else if (checkboxY) {
      setZoomaxis("y");
    } else {
      setZoomaxis("null");
    }
  }, [checkboxX, checkboxY]);

  return (
    <div>
      <label className="float-right text-black dark:text-white">
        x:
        <input type="checkbox" checked={checkboxX} onChange={HandleCheckboxX} />
        y:
        <input type="checkbox" checked={checkboxY} onChange={HandleCheckboxY} />
      </label>
      <VictoryChart
        padding={{ top: 10, bottom: 10, left: 30, right: 10 }}
        height={150}
        containerComponent={<VictoryZoomContainer zoomDimension={zoomaxis} />}
      >
        <VictoryAxis
          crossAxis
          domain={[-1.0, 1.0]}
          tickCount={20}
          height={500}
          {...YaxisProps}
          style={{
            tickLabels: {
              fontSize: chartStyles.tickLabelsFontSize,
              padding: chartStyles.tickLabelsPadding,
              fill: isDarkTheme ? "white" : "black",
            },
            grid: {
              stroke: "#D0D2D1",
              strokeWidth: chartStyles.gridStoleWidth,
            },
            axis: { stroke: isDarkTheme ? "white" : "black" },
          }}
        />
        <VictoryAxis
          dependentAxis
          crossAxis
          domain={[-1.0, 1.0]}
          tickCount={20}
          {...YaxisProps}
          style={{
            tickLabels: {
              fontSize: chartStyles.tickLabelsFontSize,
              padding: chartStyles.tickLabelsPadding,
              fill: isDarkTheme ? "white" : "black",
            },
            grid: {
              stroke: "#D0D2D1",
              strokeWidth: chartStyles.gridStoleWidth,
            },
            axis: { stroke: isDarkTheme ? "white" : "black" },
          }}
        />
        {cellData.map((dataSet, i) => (
          <VictoryGroup key={i}>
            {visibility.dl[dataSet.id] && (
              <VictoryScatter
                style={{ data: { fill: color_dl[i] } }}
                size={1}
                data={dataSet.dl_sched_users_avg}
                labels={({ datum }) =>
                  `Cell#${dataSet.id}_dl_avg:${datum.y.toFixed(2)}`
                }
                labelComponent={
                  visibility.dl[dataSet.id] ? <VictoryTooltip /> : null
                }
              />
            )}

            {visibility.ul[dataSet.id] && (
              <VictoryScatter
                style={{ data: { fill: color_ul[i] } }}
                size={1}
                data={dataSet.ul_sched_users_avg}
                labels={({ datum }) =>
                  `Cell#${dataSet.id}_ul_avg:${datum.y.toFixed(2)}`
                }
                labelComponent={
                  visibility.ul[dataSet.id] ? <VictoryTooltip /> : null
                }
              />
            )}
          </VictoryGroup>
          
        ))}
      </VictoryChart>
      {cellData.map((dataSet, i) => (
        <div key={i}>
          <VictoryLegend
            events={[
              {
                target: "data",
                eventHandlers: {
                  onClick: () => {
                    toggleVisibility(dataSet.id, "DL");
                  },
                },
              },
            ]}
            style={{
              labels: {
                fontSize: 5,
                fontWeight: "bold",
                fill: isDarkTheme ? "white" : "black",
              },
            }}
            height={10}
            data={[
              {
                name: `Cell#${dataSet.id}_dl_sched_users_avg`,
                symbol: { fill: color_dl[i], size: 2 },
              },
            ]}
          />
          <VictoryLegend
            events={[
              {
                target: "data",
                eventHandlers: {
                  onClick: () => {
                    toggleVisibility(dataSet.id, "UL");
                  },
                },
              },
            ]}
            style={{
              labels: {
                fontSize: 5,
                fontWeight: "bold",
                fill: isDarkTheme ? "white" : "black",
              },
            }}
            height={10}
            padding={{ bottom: 5 }}
            data={[
              {
                name: `Cell#${dataSet.id}_ul_sched_users_avg`,
                symbol: { fill: color_ul[i], size: 2 },
              },
            ]}
          />
        </div>
      ))}

    </div>
  );
}

export default PDSCHgraph;
