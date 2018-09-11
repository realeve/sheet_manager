import util from "../utils/lib";
import chartOption from "../utils/charts";
import {
    axios
} from "../../../utils/axios";
const R = require('ramda');

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

const decodeUrlParam = ({
    url,
    params,
    idx
}) => {
    let param = {};
    let handleKey = key => {
        let item = params[key];
        if (R.type(item) !== 'Array') {
            param[key] = item;
            return;
        }
        param[key] = item[idx] ? item[idx] : R.last(item);
    }
    R.compose(R.forEach(handleKey), R.keys)(params);
    return param;
}

export const decodeHash = ({
    tid,
    query,
    tstart,
    tend
}) => tid.map(
    (url, idx) => {
        let params = decodeUrlParam({
            url,
            params: {...query,
                tstart,
                tend,
                tstart2: tstart,
                tend2: tend,
                tstart3: tstart,
                tend3: tend
            },
            idx
        });
        return {
            url,
            params
        }
    }
);

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
        let config = R.clone(params);
        config = Object.assign(config, {
            data: dataSrc,
            dateRange: [tstart, tend]
        })
        let {
            type
        } = config;
        type = type || 'bar';

        const opt = dataSrc.data.length === 0 ? {} : chartOption[type](config);
        return util.handleDefaultOption(opt, config);
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