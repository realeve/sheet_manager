import color from '../themeColor';
import util from '../lib'
import {
    handleSunBrustData
} from './sunburst';
const R = require("ramda");

let chartConfig = [{
    key: 'type',
    title: '图表类型',
    default: 'themeriver',
    url: '/chart#id=8/26f49db157&type=themeriver'
}];


let themeriver = config => {
    let {
        data,
        header
    } = config.data;
    let legendData = [];
    let seriesData = [];
    if (config.legend) {
        seriesData = util.getDataByKeys({
            keys: [header[config.x], header[config.y], header[config.legend]],
            data
        });

        legendData = util.getUniqByIdx({
            key: header[config.legend],
            data
        });
    } else {
        data = R.pluck([header[config.x], header[config.y]])(data);
    }
    let option = {
        color: color.getColor(legendData.length, config.type),
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                lineStyle: {
                    color: 'rgba(0,0,0,0.2)',
                    width: 1,
                    type: 'solid'
                }
            }
        },
        singleAxis: {
            type: 'time',
        },
        series: [{
            type: 'themeRiver',
            itemStyle: {
                emphasis: {
                    shadowBlur: 20,
                    shadowColor: 'rgba(0, 0, 0, 0.8)'
                }
            },
            data: seriesData
        }],
        toolbox: {
            feature: {
                saveAsImage: {
                    type: "svg"
                }
            }
        }
    };
    if (config.legend) {
        option.legend = {
            data: legendData
        };
    }
    return option;
};

export {
    themeriver,
    chartConfig
};