import React, { useState, useEffect } from "react";
import data from "./data/Scheduled.json";
import { w3cwebsocket } from "websocket";
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryScatter,
  VictoryGroup,
  VictoryTheme,
  VictoryArea,
  VictoryVoronoiContainer,
  VictoryTooltip,
  VictoryZoomContainer,
  VictoryLegend,
} from "victory";
import {
  XaxisProps,
  YaxisProps,
  chartProps,
  victorygroupstyle,
  color_dl,
  color_ul,
  chartStyles,
} from "./helpers/chartstyle";

const ws = new WebSocket("ws://localhost:8080/ws");

function Scheduled({ isDarkTheme, timeRange }) {
  const [Scheduled_data, setData] = useState([]);
  const [zoomaxis, setZoomaxis] = useState("null");
  const [checkboxX, setCheckboxX] = useState(false);
  const [checkboxY, setCheckboxY] = useState(false);
  const [visibility, setVisibility] = useState({ dl: {}, ul: {} });

  useEffect(() => {
    ws.onopen = () => {
      console.log("websocket connected");
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setData(message.scheduled_data);
    };

    if (WebSocket.OPEN === ws.readyState) {
      ws.send(timeRange);
    }

    return () => {
      ws.onclose = () => {
        console.log("disconnected");
      };
    };
  }, [timeRange]);

  const cellData = Scheduled_data.map(
    ({
      timestamp,
      cells_0_dl_sched_users_avg,
      cells_0_dl_sched_users_max,
      cells_0_dl_sched_users_min,
      cells_0_ul_sched_users_avg,
      cells_0_ul_sched_users_max,
      cells_0_ul_sched_users_min,
      cells_1_dl_sched_users_avg,
      cells_1_dl_sched_users_max,
      cells_1_dl_sched_users_min,
      cells_1_ul_sched_users_avg,
      cells_1_ul_sched_users_max,
      cells_1_ul_sched_users_min,
    }) => {
      return {
        x: timestamp,
        y: {
          cells_0_dl_sched_users_avg: cells_0_dl_sched_users_avg,
          cells_0_dl_sched_users_max: cells_0_dl_sched_users_max,
          cells_0_dl_sched_users_min: cells_0_dl_sched_users_min,
          cells_0_ul_sched_users_avg: cells_0_ul_sched_users_avg,
          cells_0_ul_sched_users_max: cells_0_ul_sched_users_max,
          cells_0_ul_sched_users_min: cells_0_ul_sched_users_min,
          cells_1_dl_sched_users_avg: cells_1_dl_sched_users_avg,
          cells_1_dl_sched_users_max: cells_1_dl_sched_users_max,
          cells_1_dl_sched_users_min: cells_1_dl_sched_users_min,
          cells_1_ul_sched_users_avg: cells_1_ul_sched_users_avg,
          cells_1_ul_sched_users_max: cells_1_ul_sched_users_max,
          cells_1_ul_sched_users_min: cells_1_ul_sched_users_min,
        },
      };
    }
  );

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

    console.log(cellData);
    console.log(Scheduled_data);
  }, [checkboxX, checkboxY]);

  if (!cellData || cellData.length === 0) {
    return null; // or render a loading indicator or an error message
  }

  const lines = Object.keys(cellData[0].y).map((key, index) => (
    <VictoryGroup>
      <VictoryLine
        key={key}
        data={cellData}
        x="x"
        y={(datum) => datum.y[key]}
        style={{
          data: {
            stroke: color_dl[index],
            strokeWidth: 0.75,
          },
        }}
      />

      <VictoryScatter
        key={key}
        data={cellData}
        x="x"
        y={(datum) => datum.y[key]}
        style={{ data: { fill: color_dl[index] } }}
        size={0.5}
        labels={({ datum }) => `${key}: ${datum.y[key]}`}
        labelComponent={<VictoryTooltip />}
      />
    </VictoryGroup>
  ));

  const legendData = Object.keys(cellData[0].y).map((key, index) => (
    <VictoryLegend
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
          name: key,
          symbol: { fill: color_dl[index], size: 2 },
        },
      ]}
    />
  ));

  return (
    <div>
      <label className="float-right text-black dark:text-white">
        x:
        <input type="checkbox" checked={checkboxX} onChange={HandleCheckboxX} />
        y:
        <input type="checkbox" checked={checkboxY} onChange={HandleCheckboxY} />
      </label>
      <VictoryChart
        {...chartProps}
        containerComponent={<VictoryZoomContainer zoomDimension={zoomaxis} />}
      >
        <VictoryAxis
          tickFormat={XaxisProps.tickFormat}
          tickCount={10}
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
          label="UE/TTI"
          style={{
            axisLabel: {
              fontSize: chartStyles.tickLabelsFontSize,
              padding: 10,
              fill: isDarkTheme ? "white" : "black",
            },
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
        {lines}
      </VictoryChart>
      {legendData}
    </div>
  );
}

export default Scheduled;
