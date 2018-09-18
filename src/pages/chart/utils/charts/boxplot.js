import util from "../lib";
import dataTool from '../dataTool';
import theme from './theme';

const R = require("ramda");

const getOption = (seriesData, xAxisData, idx, name) => {
    let {
        boxData,
        outliers
    } = dataTool.prepareBoxplotData(seriesData);
    let color = theme.color[idx % theme.color.length]
    return [{
            name,
            type: 'boxplot',
            data: boxData,
            tooltip: {
                formatter: function(param) {
                    return [
                        'Experiment ' + param.name + ': ',
                        'upper: ' + param.data[5],
                        'Q3: ' + param.data[4],
                        'median: ' + param.data[3],
                        'Q1: ' + param.data[2],
                        'lower: ' + param.data[1]
                    ].join('<br/>');
                }
            },
            itemStyle: {
                borderColor: color
            }
        },
        {
            name,
            type: 'scatter',
            data: outliers,
            itemStyle: {
                color
            }
        }
    ]

}

export const init = option => {
    let {
        header,
        data
    } = option.data;
    let xIdx, yIdx;
    if (option.legend) {
        xIdx = option.x || 1;
        yIdx = option.y || 2;
    } else {
        xIdx = option.x || 0;
        yIdx = option.y || 1;
    }

    let seriesData = [],
        series = [];

    let xAxisData = util.getUniqByIdx({
        key: header[xIdx],
        data
    });

    let config = {
        xAxis: {
            type: 'category',
            data: xAxisData,
            scale: true
        },
        yAxis: {
            type: 'value',
            scale: true
        }
    }

    if (!option.legend) {
        seriesData = xAxisData.map(name => R.compose(R.pluck(header[yIdx]), R.filter(R.propEq(header[xIdx], name)))(data))
        series = getOption(seriesData, xAxisData);
        return {
            ...config,
            series
        }
    }

    let legendData = util.getUniqByIdx({
        key: header[option.legend],
        data
    });

    legendData.forEach((legendName, idx) => {
        seriesData = xAxisData.map(xName => {
            let dataList = R.filter(R.whereEq({
                [header[option.legend]]: legendName,
                [header[option.x]]: xName
            }))(data);
            if (dataList.length === 0) {
                return []
            }
            return R.compose(R.pluck(header[yIdx]), R.filter(R.propEq(header[xIdx], xName)))(dataList)
        });
        series = [...series, ...getOption(seriesData, xAxisData, idx, legendName)]
    })
    return {
        ...config,
        series,
        legend: {
            data: util.getLegendData(legendData),
        }
    }
}