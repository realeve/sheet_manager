import ecStat from "echarts-stat";
import jStat from "jStat";
import util from "../lib";
import theme from './theme';
const R = require("ramda");

const getBin = data => {
    // doc about histogram see here:https://github.com/ecomfe/echarts-stat#histogram
    // scott | freedmanDiaconis | sturges | none
    // squareRoot - This is the default method, which is also used by Excel histogram. Returns the number of bin according to

    let bin = ecStat.histogram(data);
    let binItem = bin.data;
    let splitArr = bin.data.map(item => item[0]);

    let mean = jStat.mean(data);
    let std = jStat.stdev(data);

    let binWidth = binItem[1][0] - binItem[0][0];

    let pdf = splitArr.map((value, i) => ({
        value,
        pdf: jStat.normal.pdf(value, mean, std)
    }));
    return {
        pdf,
        binWidth,
        binItem
    }
}

const getSeriesItem = (seriesData, idx, name) => {
    let {
        pdf,
        binItem
    } = getBin(seriesData);
    let series = {
        type: 'bar',
        barWidth: '99.3%',
        label: {
            normal: {
                show: true,
                position: 'insideTop',
                formatter: ({
                    value
                }) => value[1]
            }
        },
        data: binItem
    };

    let pdfSeries = {
        name,
        type: 'line',
        smooth: true,
        data: R.map(R.values)(pdf),
        yAxisIndex: 1,
        z: 10,
        symbolSize: 0,
        color: theme.color[(idx + 5) % theme.color.length]
    }
    if (name) {
        return [{...series,
            name
        }, pdfSeries]
    }
    return [series, pdfSeries];
}

export const handleHistogram = option => {
    let {
        header,
        data
    } = option.data;
    let xIdx = option.legend ? option.x : 0;
    let series = [];
    let seriesData = [];

    let config = {
        yAxis: [{
            type: 'value',
        }, {
            type: 'value',
            name: 'PDF'
        }],
        xAxis: {
            name: header[xIdx],
            type: 'value',
            scale: true
        },
        dataZoom: [{
            type: "inside",
            realtime: true,
            start: 0,
            end: 100,
            xAxisIndex: 0
        }]
    };

    if (!option.legend) {
        seriesData = util.getDataByIdx({
            key: header[xIdx],
            data
        });
        series = getSeriesItem(seriesData, 0);
        return {...config,
            series
        }
    }

    let legendData = util.getUniqByIdx({
        key: header[option.legend],
        data
    });
    legendData.forEach((name, idx) => {
        let seriesData = R.compose(R.pluck(header[option.x]), R.filter(R.propEq(header[option.legend], name)))(data);
        series = [...series, ...getSeriesItem(seriesData, idx, name)]
    });

    return {...config,
        series,
        legend: {
            data: legendData.map(name => ({
                name,
                icon: 'circle'
            })),
            selectedMode: option.multilegend ? 'multiple' : 'single'
        }
    }
}