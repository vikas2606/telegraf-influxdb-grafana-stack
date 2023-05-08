import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectTheme } from "../store/store";
import { getGrafanaSourceSnapshot } from "./BenchmarkSources";
import { getGrafanaGraphSnapshot } from "./BenchmarkSources";

import ThroughPutGraph from "../victorygraphs/ThroughPutGraph";
import PacketsGraph from "../victorygraphs/PacketsGraph";
import Scheduled from "../victorygraphs/Scheduled";
import PDSCHgraph from "../victorygraphs/PDSCHgraph";

const timeRanges = {
  "Last 5 minutes": "now-5m",
  "Last 10 minutes": "now-10m",
  "Last 30 minutes": "now-30m",
  "Last 1 hour": "now-1h",
  "Last 3 hours": "now-3h",
  "Last 6 hours": "now-6h",
  "Last 12 hours": "now-12h",
  "Last 24 hours": "now-24h",
  "Last 2 days": "now-2d",
  "Last 7 days": "now-7d",
  "Last 90 days":"now-90d"
};

const refreshRanges = {
  "5s": "5s",
  "10s": "10s",
  "30s": "30s",
  "1m": "1m",
  "2m": "2m",
  "5m": "5m",
  "10m": "10m",
  "30m": "30m",
  "1h": "1h",
  "3h": "3h",
  "1d": "1d",
};

const graphs = {
  grafana: "grafana",
  victory: "victory",
};

const BenchmarkGraph = () => {
  const isDarkTheme = useSelector(selectTheme);
  const [viewGraph, setViewGraph] = useState("victory");
  const [timeRange, setTimeRange] = useState("Last 5 minutes");
  const [fromDate, setFromDate] = useState("now-5m");
  const [toDate, setToDate] = useState("now");
  const [refreshTime, setRefreshTime] = useState("1m");

  const grafanaSources = getGrafanaSourceSnapshot();
  const sourcesToShow = Object.values(grafanaSources);

  const grafanaGraphs = getGrafanaGraphSnapshot();
  const graphsToShow = Object.values(grafanaGraphs);

  const itemsToShow = [...sourcesToShow, ...graphsToShow];

  function datetimeLocaltoUnix(datetime) {
    if (datetime.startsWith("now")) {
      return datetime;
    }
    const dateObj = new Date(Date.parse(datetime));
    const unixTimestamp = Math.floor(dateObj.getTime());
    return unixTimestamp;
  }

  useEffect(() => {
    setFromDate(timeRanges[timeRange]);
    setRefreshTime(refreshRanges[refreshTime]);
  }, [timeRange, refreshTime]);

  itemsToShow.forEach((source) => {
    const url = new URL(source.src);
    url.searchParams.set("theme", isDarkTheme ? "dark" : "light");
    url.searchParams.set("from", datetimeLocaltoUnix(fromDate));
    url.searchParams.set("to", datetimeLocaltoUnix(toDate));
    url.searchParams.set("refresh", refreshTime);
    source.src = url.toString();
  });

  const handleFromDateChange = (event) => {
    setFromDate(event.target.value);
  };
  const handleToDateChange = (event) => {
    setToDate(event.target.value);
  };
  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };
  const handleRefreshRangeChange = (event) => {
    setRefreshTime(event.target.value);
  };

  const handleGraphChange = (event) => {
    setViewGraph(event.target.value);
  };

  return (
    <div class="bg-gray-200 dark:bg-simnovous-teal overflow-x-hidden flex-auto w-auto">
      <div className="flex flex-row justify-end">
        <select
          id="time-range-select"
          onChange={handleGraphChange}
          value={viewGraph}
          className="px-4 py-2 rounded-md mt-4 mx-2 dark:bg-simnovous-dark-teal dark:text-white"
        >
          {Object.keys(graphs).map((key) => (
            <option key={key} value={key} className="dark:text-white">
              {key}
            </option>
          ))}
        </select>
      </div>
      {viewGraph === "victory" ? (
        <div>
          <div className="relative overflow-hidden p-4 w-100%">
            <div className=" shadow-md border-2 p-4 border-gray-400 dark:border-simnovous-dark-teal rounded-lg bg-white dark:bg-simnovous-dark-teal ">
              <ThroughPutGraph isDarkTheme={isDarkTheme} />
            </div>
          </div>
          <div className="relative pb-56.25 overflow-hidden p-4 w-100%">
            <div className=" shadow-md border-2 p-4 border-gray-400 dark:border-simnovous-dark-teal rounded-lg bg-white dark:bg-simnovous-dark-teal ">
              <Scheduled isDarkTheme={isDarkTheme} />
            </div>
          </div>

          <div className="relative pb-56.25 overflow-hidden p-4 w-100%">
            <div className="shadow-md border-2 p-4 border-gray-400 dark:border-simnovous-dark-teal rounded-lg bg-white dark:bg-simnovous-dark-teal ">
              <PacketsGraph isDarkTheme={isDarkTheme} />
            </div>
          </div>
          <div className="relative pb-56.25 overflow-hidden p-4 w-100%">
            <div className="shadow-md border-2 p-4 border-gray-400 dark:border-simnovous-dark-teal rounded-lg bg-white dark:bg-simnovous-dark-teal ">
              <PDSCHgraph isDarkTheme={isDarkTheme}/>
            </div>
          </div>
        </div>
      ) : (
        <div class="bg-gray-200 dark:bg-simnovous-teal">
          {" "}
          <div className="flex flex-row justify-end">
            <select
              id="time-range-select"
              onChange={handleTimeRangeChange}
              value={timeRange}
              className="px-4 py-2 rounded-md mt-4 mx-2 dark:bg-simnovous-dark-teal dark:text-white"
            >
              {Object.keys(timeRanges).map((key) => (
                <option key={key} value={key} className="dark:text-white">
                  {key}
                </option>
              ))}
            </select>

            <select
              id="refresh-range-select"
              onChange={handleRefreshRangeChange}
              value={refreshTime}
              placeholder="refresh"
              className="px-4 py-2 rounded-md mt-4 mx-2  dark:bg-simnovous-dark-teal  dark:text-white"
              data-dropdown-toggle="dropdownHover"
            >
              {Object.keys(refreshRanges).map((key) => (
                <option key={key} value={key} className="dark:text-white">
                  {key}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-wrap rounded-1g p-4 overflow-hidden justify-between bg-gray-200 dark:bg-simnovous-teal">
            {sourcesToShow.map((source) => (
              <iframe
                className=" flex-wrap rounded-1g overflow-hidden justify-between p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-simnovous-dark-teal dark:border-gray-700 panel"
                src={source.src}
                width="200"
                height="200"
              />
            ))}
          </div>
          <div className="bg-gray-200 dark:bg-simnovous-teal w-full p-4 text-center overflow-hidden">
            {graphsToShow.map((source) => (
              <iframe
                className=" flex-wrap rounded-1g overflow-hidden justify-between p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-simnovous-dark-teal dark:border-gray-700 panel"
                src={source.src}
                width="100%"
                height="450"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BenchmarkGraph;
