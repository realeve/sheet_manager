// import request from "../../../utils/request";
import axios from "axios";
import * as lib from "../../../utils/lib";
import util from "../utils/lib";
import chartOption from "../utils/charts";

export const fetchData = async ({ url, params }) =>
  await axios({ url, params }).then(res => res.data);

export const getQueryConfig = ({ tid, tstart, tend, idx }) => ({
  type: "fetchAPIData",
  payload: {
    url: lib.apiHost,
    params: {
      ID: tid,
      cache: 10,
      tstart,
      tend,
      tstart2: tstart,
      tend2: tend,
      tstart3: tstart,
      tend3: tend
    },
    idx
  }
});

export const getChartOption = (data, idx, dateRange) => {
  let config = util.getChartConfig(idx);
  config.data = data;
  config.dateRange = dateRange;
  let { type } = config;
  type = type === "line" ? "bar" : type;
  const opt = data.length === 0 ? {} : chartOption[type](config);

  return util.handleDefaultOption(opt, config);
};
