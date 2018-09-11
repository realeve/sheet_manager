import util from "../utils/lib";
import chartOption from "../utils/charts";
import {
    axios
} from "../../../utils/axios";

export const fetchData = params => axios(params)

export const getQueryConfig = (url, params) => ({
    url,
    params: {...params,
        tstart2: params.tstart,
        tend2: params.tend,
        tstart3: params.tstart,
        tend3: params.tend
    }
});

export const getChartOption = (data, idx, dateRange) => {
    let config = util.getChartConfig(idx);
    config.data = data;
    config.dateRange = dateRange;
    let {
        type
    } = config;
    type = type || 'bar';

    const opt = data.length === 0 ? {} : chartOption[type](config);
    return util.handleDefaultOption(opt, config);
};

export const computeDerivedState = async({
    url,
    params,
    idx
}) => {
    console.time()
    let dataSrc = await axios({
        url,
        params
    });
    const option = getOption({
        dataSrc,
        params,
        idx
    });
    console.log(`option=${JSON.stringify(option)}`);
    console.timeEnd()
    return {
        dataSrc,
        option,
        loading: false
    };
}

export const getOption = ({
    dataSrc,
    params,
    idx
}) => {
    let {
        tstart,
        tend
    } = params;
    if (dataSrc.rows) {
        // 根据地址栏参数顺序决定图表配置顺序
        return getChartOption(dataSrc, idx, [tstart, tend]);
    }

    return {
        tooltip: {},
        xAxis: {
            type: "category"
        },
        yAxis: {
            type: "value"
        },
        series: []
    };
}