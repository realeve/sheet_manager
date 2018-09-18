const R = require("ramda");

export const init = option => {
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