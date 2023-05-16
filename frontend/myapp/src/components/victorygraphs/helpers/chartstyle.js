import data from "../data/ThroughPut.json";
import HighestBitrate from "./HighestBitrate";
import BitrateConverter from "./BitrateConverter";

const timeFormat = (date) =>
  `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

export const color_dl = [
  "#008000",
  "#00FF00",
  "#2E8B57",
  "#3CB371",
  "#32CD32",
  "#90EE90",
  "#98FB98",
  "#7FFF00",
  "#9ACD32",
  "#228B22",
  "#0000FF",
  "#1E90FF",
  "#4169E1",
  "#6495ED",
  "#87CEEB",
  "#ADD8E6",
  "#B0C4DE",
  "#4682B4",
  "#87CEFA",
  "#00BFFF",
];
export const color_ul = [
  "#0000FF",
  "#1E90FF",
  "#4169E1",
  "#6495ED",
  "#87CEEB",
  "#ADD8E6",
  "#B0C4DE",
  "#4682B4",
  "#87CEFA",
  "#00BFFF",
];
export const color_err = [
  "#FF0000",
  "#FF4500",
  "#DC143C",
  "#FF69B4",
  "#FFC0CB",
  "#FFA07A",
  "#CD5C5C",
  "#B22222",
  "#8B0000",
  "#800000",
];

export const chartStyles = {
  tickLabelsFontSize: 5,
  tickLabelsPadding: 1,
  gridStoleWidth:0.5

};

export const chartProps = {
  padding: { top: 0, bottom: 10, left: 30, right: 10 },
  height: 150,
  minDomain: { y: 0 },
};

export const XaxisProps = {
  tickFormat: (x) => timeFormat(new Date(x)),
  style: {
    tickLabels: { fontSize: 5, padding: 1 },

    grid: {
      stroke: "#D0D2D1",
      stroleWidth: 0.5,
    },
  },
};

export const YaxisProps = {
  style: {
    tickLabels: { fontSize: 5, padding: 1 },

    grid: { stroke: "#D0D2D1", stroleWidth: 0.5 },
  },
};

export const victorygroupstyle = {
  data: { strokeWidth: 0.75, fillOpacity: 0 },
};
