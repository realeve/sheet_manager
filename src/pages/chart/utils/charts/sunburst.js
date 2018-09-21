import util from "../lib";
import jStat from 'jStat';

const R = require("ramda");

let chartConfig = [{
    key: 'type',
    title: '图表类型',
    default: 'sunburst',
    url: '/chart#id=8/26f49db157&type=sunburst'
}, {
    key: 'border',
    type: '最外层数据是否显示为细线条样式',
    default: '1',
    url: '/chart#id=8/26f49db157&type=sunburst&border=1'
}];

let getColSum = (data, key) => {
    let vals = R.pluck(key, data);
    return R.sum(vals);
}

let handleSunBrustData = (data, header, colorful = true) => {
    // 剩余待处理的header
    let _header = R.tail(header);

    // 当前字段
    let key = R.head(header);

    // 数据列所在字段
    let valKey = R.last(header);

    // 当前字段共几个非重复元素
    let itemList = util.getUniqByIdx({
        key,
        data
    });
    return itemList.map(name => {
        let _data = R.compose(R.map(R.pick(_header)), R.filter(R.propEq(key, name)))(data);
        let res = {
            name,
            value: getColSum(_data, valKey)
        }
        if (colorful) {
            res.itemStyle = {
                color: util.colors[Math.floor(Math.random() * util.colors.length)]
            }
        }

        if (_header.length > 1) {
            res.children = handleSunBrustData(_data, _header, colorful);
        }
        return res;
    })
}

let getLevels = (len, config) => {
    if (len < 2) {
        return null;
    }

    let showBorder = config.border === '1';

    let from = 15,
        to = 70;
    let levels = jStat.seq(from, to, len + (showBorder ? 0 : 1));
    let res = [];
    levels.forEach((r0, i) => {
        if (i === levels.length - 1) {
            return;
        }
        res.push({
            r0: r0 + '%',
            r: levels[i + 1] + '%',
            label: {
                align: 'right'
            },
            itemStyle: {
                borderWidth: 2
            }
        });
    })

    res[0].label = {
        rotate: 'tangential'
    };

    if (showBorder) {
        res.push({
            r0: R.last(levels) + '%',
            r: (R.last(levels) + 3) + '%',
            label: {
                position: 'outside',
                padding: 3,
                silent: false
            },
            itemStyle: {
                borderWidth: 3
            }
        })
    }

    return [{}, ...res];
}

let sunburst = config => {
    let {
        data,
        header
    } = config.data;

    config.border = config.border || '1';

    let seriesData = handleSunBrustData(data, header, config.type);
    let levels = getLevels(header.length - 1, config);

    let series = {
        type: "sunburst",
        highlightPolicy: 'ancestor',
        radius: [0, '95%'],
        data: seriesData,
        sort: null,
        levels
    }

    return {
        series,
        tooltip: {
            trigger: "item"
        },
        legend: {
            show: false
        },
        toolbox: {
            feature: {
                saveAsImage: {
                    type: "svg"
                }
            }
        }
    };
};

export {
    sunburst,
    chartConfig,
    handleSunBrustData
};