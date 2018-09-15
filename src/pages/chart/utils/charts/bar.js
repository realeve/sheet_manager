import util from "../lib";
import jStat from 'jStat';
const R = require("ramda");

let chartConfig = [{
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
        default: '当legend存在时，legend/x/y默认为0，1，2'
    },
    {
        key: 'type',
        title: '图表类型',
        default: 'bar，默认；line，曲线图'
    },
    {
        key: 'smooth',
        title: '平滑曲线',
        default: '1/0  是/否'
    },
    {
        key: 'stack',
        title: '堆叠数据',
        default: 0
    }, {
        key: 'area',
        title: '曲线图中开启该项则显示面积图',
        default: 0
    }, {
        key: 'zoom',
        title: '是否显示缩放条',
        default: 0
    }, {
        key: 'reverse',
        title: '交换x/y轴',
        default: 0
    }, {
        key: 'pareto',
        title: '显示帕累托曲线',
        default: 0,
        url: '/chart#id=6/8d5b63370c&data_type=score&x=3&y=4&legend=2&type=line&smooth=1&area=1&pareto=1'
    }, {
        key: 'min/max',
        title: 'Y轴最小值/最大值',
        default: '自动设置'
    }, {
        key: 'barWidth 或 barwidth',
        title: '柱状图柱条最大宽度',
        default: 'auto'
    }, {
        key: 'barshadow',
        title: '显示柱状图背景',
        default: 0,
        url: '/chart#id=6/8d5b63370c&data_type=score&x=3&y=4&legend=2&type=bar&barshadow=1'
    }, {
        key: 'pictorial',
        title: '是否使用象形柱图',
        default: 0
    },
    {
        key: 'symbol',
        title: '象形柱图使用三角形/弧形',
        default: '0:三角形,1：弧形',
        url: '/chart#id=6/8d5b63370c&data_type=score&x=3&y=4&type=bar&legend=2&pictorial=1&symbol=1'
    }
];

let symbol = {
    triangle: 'path://M0,10 L10,10 L5,0 L0,10 z',
    roundAngle: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z'
}

let getOption = options => {
    let option;
    switch (options.data.header.length) {
        case 3:
            option = {
                legend: 0,
                x: 1,
                y: 2
            };
            break;
        case 2:
        default:
            option = {
                x: 0,
                y: 1
            };
            break;
    }
    option = Object.assign(
        option, {
            type: "bar",
            smooth: true
        },
        options
    );
    R.forEach(key => (option[key] = parseInt(option[key], 10)))([
        "x",
        "y",
        "legend"
    ]);
    option.smooth = option.smooth !== "0";

    if (option.pictorial) {
        option.type = 'pictorialBar';
    }

    return option;
};

let handleDataWithLegend = (srcData, option) => {
    let {
        data,
        header
    } = srcData;

    let xAxis = R.sort((a, b) => a - b)(util.getUniqByIdx({
        key: header[option.x],
        data
    }));

    let legendData = util.getUniqByIdx({
        key: header[option.legend],
        data
    });

    let getSeriesData = name => {
        let dataList = R.filter(R.propEq(header[option.legend], name))(data);
        let seriesData = R.map(item => {
            let temp = R.find(R.propEq(header[option.x], item))(dataList);
            return R.isNil(temp) ? "-" : R.prop(header[option.y])(temp);
        })(xAxis);
        return {
            data: seriesData,
            name,
            type: option.type,
            smooth: option.smooth
        };
    };

    let series = R.map(getSeriesData)(legendData);
    return {
        series,
        xAxis
    };
};

let handleDataNoLegend = (srcData, option) => {
    let {
        data,
        header
    } = srcData;

    let xAxis = R.sort((a, b) => a - b)(util.getDataByIdx({
        data,
        key: header[option.x]
    }));

    let getSeriesData = () => {
        let seriesData = R.map(item =>
            R.compose(R.nth(option.y), R.find(R.propEq(option.x, item)))(data)
        )(xAxis);
        return {
            data: seriesData,
            type: option.type,
            smooth: option.smooth
        };
    };
    let series = getSeriesData();
    return {
        series,
        xAxis
    };
};

let handleData = (srcData, option) => {
    if (R.has("legend", option)) {
        return handleDataWithLegend(srcData, option);
    }
    return handleDataNoLegend(srcData, option);
};

let handleSeriesItem = option => seriesItem => {
    if (option.area && option.type !== "bar") {
        seriesItem.areaStyle = {
            normal: {
                opacity: 0.4
            }
        };
    }

    if (option.stack) {
        seriesItem.stack = "All";
    }

    // 堆叠数据需保证数据类型不为字符串
    if (option.stack) {
        seriesItem = R.assoc("data", R.map(util.str2Num)(seriesItem.data))(
            seriesItem
        );
    }

    if (option.barWidth || option.barwidth) {
        seriesItem.barMaxWidth = option.barWidth || option.barwidth
    }

    if (option.type === 'pictorialBar') {
        seriesItem = Object.assign({}, seriesItem, {
            itemStyle: {
                normal: {
                    opacity: 0.6
                },
                emphasis: {
                    opacity: 1
                }
            },
            barGap: '0',
            symbol: option.symbol == '0' ? symbol.triangle : symbol.roundAngle
        });
    }

    return seriesItem;
};

let getChartConfig = options => {
    let option = getOption(options);
    let {
        data
    } = options;
    let {
        header
    } = data;

    let {
        xAxis,
        series
    } = handleData(data, option);

    let dateAxis = util.needConvertDate(R.path(["xAxis", 0], xAxis));
    if (dateAxis) {
        xAxis = R.map(util.str2Date)(xAxis);
    }
    series = R.map(handleSeriesItem(option))(series);

    // 只有一项时
    // if (series.length === 1 && series[0].type === 'bar') {
    if (option.barshadow) {
        let {
            data,
            barMaxWidth
        } = series[0];
        let max = jStat.max(data);
        data = data.map(item => max);
        series[0].z = 10;
        let seriesItem = {
            type: 'bar',
            itemStyle: {
                normal: {
                    "color": "rgba(0,0,0,0.1)"
                }
            },
            silent: true,
            // barWidth: 40,
            barGap: '-100%',
            data
        };
        if (barMaxWidth) {
            seriesItem.barMaxWidth = barMaxWidth;
        }
        series.push(seriesItem)
    }

    let axisOption = {
        nameLocation: "center",
        nameGap: 60,
        nameTextStyle: {
            fontWeight: "bold"
        }
    };

    let yAxis = {
        name: header[option.y],
        ...axisOption
    };

    if (options.max) {
        yAxis.max = parseFloat(options.max);
    }
    if (options.min) {
        yAxis.min = parseFloat(options.min);
    }

    xAxis = {
        data: xAxis,
        name: header[option.x],
        ...axisOption
    };

    return {
        xAxis,
        series,
        yAxis,
        dataZoom: [{
            type: "inside",
            realtime: true,
            start: 0,
            end: 100,
            xAxisIndex: 0
        }]
    };
};

// http://localhost:8000/chart#id=6/8d5b63370c&data_type=score&x=3&y=4&legend=2
// test URL: http://localhost:8000/chart/133#type=bar&x=0&y=1&smooth=1&max=100&min=70
// http://localhost:8000/chart/145#type=line&legend=0&x=1&y=2&smooth=1&max=100&min=70
let bar = options => {
    let option = getChartConfig(options);

    if (!options.stack) {
        option.dataZoom.push({
            type: "inside",
            realtime: true,
            start: 0,
            end: 100,
            yAxisIndex: 0
        });
    }

    let {
        xAxis,
        yAxis
    } = option;
    if (options.reverse) {
        option.xAxis = yAxis;
        option.yAxis = xAxis;

        option.grid = {
            left: 100
        };
        option.yAxis.nameGap = 70;
    }

    if (options.zoom) {
        option.dataZoom.push({
            realtime: true,
            start: 0,
            end: 100
        });
    }

    // 印制产品颜色处理
    let configs = util.handleColor(option);

    // 帕累托图
    if (options.pareto) {
        configs = handlePareto(option);
    }

    // 极坐标系
    if (options.polar) {
        configs = Object.assign(configs, {
            radiusAxis: {},
            polar: {},
            angleAxis: configs.xAxis
        });
        Reflect.deleteProperty(configs, "dataZoom");
        Reflect.deleteProperty(configs, "xAxis");
        Reflect.deleteProperty(configs, "yAxis");
        configs.series = R.map(R.assoc("coordinateSystem", "polar"))(
            configs.series
        );
    }

    return configs;
};

const handlePareto = option => {
    let yAxis = option.yAxis;
    let {
        name
    } = yAxis;
    option.yAxis = [
        yAxis,
        {
            name: "帕累托(%)",
            nameLocation: "middle",
            nameGap: 36,
            nameTextStyle: {
                fontSize: 16
            },
            type: "value",
            position: "right",
            scale: true,
            axisLabel: {
                show: true,
                interval: "auto",
                margin: 10,
                textStyle: {
                    fontSize: 16
                }
            },
            axisTick: {
                show: false
            },
            splitArea: {
                show: false
            },
            max: 100,
            min: 0
        }
    ];
    option.legend = {
        data: [name, "Pareto"]
    };
    option.series[0].name = name;

    let source = option.series[0].data;
    // const g = i => j => R.update(1, parseFloat(R.nth(1)(i)))(j);
    // source = R.compose(R.sortBy(R.descend(R.nth(1))), R.map(i => g(i)(i)))(
    //   source
    // );

    // console.log(source);
    // source = R.compose(
    //     R.sortBy(R.descend(R.nth(1))),
    //     R.map(R.adjust(parseFloat, 1))
    // )(source);

    let valueIndex = R.clone(source);
    valueIndex.forEach((item, i) => {
        if (i < valueIndex.length - 1) {
            valueIndex[i + 1] = parseInt(valueIndex[i + 1], 10) + parseInt(item, 10);
        }
    });
    let sum = R.last(valueIndex);
    let paretoData = R.map(item => (100 * parseInt(item, 10) / sum).toFixed(2))(
        valueIndex
    );

    option.grid = {
        right: 50
    };

    option.series.push({
        name: "Pareto",
        yAxisIndex: 1,
        data: paretoData,
        markLine: {
            symbol: "none",
            lineStyle: {
                normal: {
                    type: "dot"
                }
            },
            data: [{
                name: "80%",
                yAxis: 80,
                label: {
                    normal: {
                        show: false
                    }
                }
            }]
        },
        type: "line",
        smooth: true,
        symbolSize: "4",
        symbol: "circle",
        lineStyle: {
            normal: {
                width: 2,
                type: "solid",
                shadowColor: "rgba(0,0,0,0)",
                shadowBlur: 0,
                shadowOffsetX: 0,
                shadowOffsetY: 0
            }
        }
    });
    return option;
};

export {
    bar,
    chartConfig
};