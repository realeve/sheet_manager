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
    }, {
        key: 'x',
        title: 'X轴在数据的索引或键值',
        default: 0
    },
    {
        key: 'y',
        title: 'Y轴在数据的索引或键值',
        default: 1
    },
    {
        key: 'legend',
        title: '数据序列的索引或键值',
        default: '不设置时，legend/x/y默认为0，1，2;如果数据列最多只有2列，则x/y为 0/1',
        url: '/chart#id=8/26f49db157&area=1&type=line'
    }
];


let themeriver = config => {
    let {
        data,
        header
    } = config.data;

    if (header.length === 2) {
        config.x = config.x || 0;
        config.y = config.y || 1;
    } else if (header.length === 3) {
        config.legend = config.legend || 0;
        config.x = config.x || 1;
        config.y = config.y || 2;
    }

    let legendData = [];
    let seriesData = [];
    if (!R.isNil(config.legend)) {
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
        toolbox: {}
    };
    if (!R.isNil(config.legend)) {
        option.legend = {
            data: util.getLegendData(legendData)
        };
    }
    return option;
};

export {
    themeriver,
    chartConfig
};