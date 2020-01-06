import util from '../lib';
import jStat from 'jStat';
// import themeColor from '../themeColor';
// import theme from './theme';
const R = require('ramda');

let chartConfig = [{
        key: 'type',
        title: '图表类型',
        default: 'bar3d:3维柱状图,line3d:3维线形图,scatter3d:3维散点图,surface:3维曲面图,使用surface时，x/y轴的数值必须连续，z在x/y的坐标中都必须对应坐标点,x轴长度大于y',
        url: [
            '/chart#id=36/0297ce54b9&type=bar3d',
            '/chart#id=9/a043209280&type=bar3d&x=1&y=2&z=3',
            '/chart#id=9/a043209280&type=bar3d&x=0&y=2&z=3',
            '/chart#id=36/0297ce54b9&type=surface&x=1&y=0&z=2',
            '/chart#id=36/0297ce54b9&type=scatter3d&x=1&y=0&z=2',
            '/chart#id=36/0297ce54b9&type=line3d&x=1&y=0&z=2',
            '/chart#id=50/f317ed4bb9&render=canvas&type=bar3d&smooth=1&stack=1&x=0&y=1&z=2&group=3'
        ]
    },
    {
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
        key: 'z',
        title: 'Z轴在数据的索引或键值',
        default: 2
    },
    {
        key: 'shading',
        title: '渲染模式',
        default: '0:color;1:lambert, 2:realistic'
    }
];

let getOption = (config) => {
    let option = R.clone(config);
    option = Object.assign({
            x: 0,
            y: 1,
            z: 2,
            shading: 0
        },
        option
    );

    let {
        xAxis,
        xAxisType
    } = util.getAxis(config.data, option.x);
    let {
        xAxis: yAxis,
        xAxisType: yAxisType
    } = util.getAxis(
        config.data,
        option.y
    );
    let {
        xAxis: zAxis
    } = util.getAxis(config.data, option.z);

    option = Object.assign(option, {
        xAxisType,
        yAxisType,
        xAxis,
        yAxis,
        zAxis
    });
    return option;
};

let chartType = {
    bar3d: 'bar3D',
    line3d: 'line3D',
    scatter3d: 'scatter3D',
    surface: 'surface'
};

let bar3d = (config) => {
    // let option = {};
    config = getOption(config);
    let {
        header,
        data
    } = config.data;
    let {
        x,
        y,
        z
    } = config;
    const type = chartType[config.type];
    let max = jStat.max(config.zAxis);
    let color = [
        '#313695',
        '#4575b4',
        '#74add1',
        '#abd9e9',
        '#e0f3f8',
        '#ffffbf',
        '#fee090',
        '#fdae61',
        '#f46d43',
        '#d73027',
        '#a50026'
    ];
    let axisSetting = {
        axisLine: {
            lineStyle: {
                color: '#aaa',
                width: 2
            }
        },
        boundaryGap: true,
        nameTextStyle: {
            fontSize: 16,
            color: '#555'
        },
        axisLabel: {
            textStyle: {
                color: '#222'
            }
        },
        splitLine: {
            show: true
        },
        splitArea: {
            show: false
        }
    };
    return {
        tooltip: {
            trigger: 'item'
        },
        visualMap: {
            max,
            inRange: {
                color //: theme.color //themeColor.COLOR_PLATE_24 //.getColor(config.xAxis.length, type)
            },
            show: false
        },
        grid3D: {
            viewControl: {
                autoRotate: true
            },
            light: {
                main: {
                    shadow: true,
                    quality: "ultra",
                    intensity: 1.2
                },
                ambient: {
                    intensity: 0.3
                },
                ambientCubemap: {
                    // texture: './lake.hdr',
                    exposure: 1,
                    diffuseIntensity: 0.5,
                    specularIntensity: 2
                }
            },
            postEffect: {
                enable: true,
                SSAO: {
                    enable: true,
                    radius: 2,
                    intensity: 1,
                    quality: "high"
                }
            },
            temporalSuperSampling: {
                enable: true
            }
        },
        xAxis3D: {
            type: config.xAxisType,
            data: config.xAxis,
            ...axisSetting
        },
        yAxis3D: {
            type: config.yAxisType,
            data: config.yAxis,
            ...axisSetting
        },
        zAxis3D: {
            ...axisSetting
        },
        series: [{
            type,
            data: util.getDataByKeys({
                keys: [header[x], header[y], header[z]],
                data
            }),
            scatterSize: 40,
            label: {
                show: type === 'bar3D',
                textStyle: {
                    fontSize: 12,
                    borderWidth: 1
                }
            },
            shading: ['color', 'lambert', 'realistic'][config.shading],
            itemStyle: {
                opacity: 0.65
            },
            emphasis: {
                itemStyle: {
                    opacity: 0.9
                }
            }
        }]
    };
};

export {
    bar3d,
    chartConfig
};