import util from '../lib'
import jStat from 'jStat';
import moment from 'moment'

const R = require("ramda");

let color = ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'];
let getCalendarStyle = name => ({
    left: 'center',
    splitLine: {
        show: false,
        lineStyle: {
            width: 0,
            type: 'solid'
        }
    },
    yearLabel: {
        formatter: '{start}' + (R.isNil(name) ? '' : `(${name})`),
        textStyle: {
            color: '#667',
            fontSize: 16
        }
    },
    monthLabel: {
        nameMap: 'cn'
    },
    dayLabel: {
        firstDay: 1,
        nameMap: 'cn'
    },
    itemStyle: {
        normal: {
            color: '#ebedf0',
            borderWidth: 2,
            borderColor: '#fff'
        }
    }
});

let chartConfig = [{
        key: 'type',
        title: '图表类型',
        default: 'calendar',
        url: ['/chart#id=17/f378da2c28&type=calendar&size=20&legend=0&startmode=day']
    }, {
        key: 'x',
        title: 'X轴在数据的索引或键值。在日历图中，X轴格式为 YYYY-MM-DD.',
        default: 0
    },
    {
        key: 'y',
        title: 'Y轴在数据的索引或键值',
        default: 1
    },
    {
        key: 'legend',
        title: '数据序列的索引或键值，此时不显示legend切换而是直接依次渲染',
        default: '不设置时，数据超过2列，legend/x/y默认为0，1，2;如果数据列最多只有2列，则x/y为 0/1。legend只允许选择单项',
    }, {
        key: 'size',
        title: '方格大小',
        default: 20
    },
    {
        key: 'orient',
        title: '水平/垂直布局',
        default: 'horizontal:水平,vertical:垂直',
    }, {
        key: 'startmode',
        title: '起止时间以当前最大/最小日期还是以其对应的月份',
        default: 'day/month,默认以当天最小日期开始',
        url: '/chart#id=17/f378da2c28&type=calendar&size=20&legend=0&startmode=day'
    }
];

let handleConfig = config => {
    let {
        legend,
        x,
        y,
        z
    } = config;
    let {
        header
    } = config.data;
    if (header.length > 2) {
        x = x || 1;
        y = y || 2;
        z = z || 3;
    } else {
        x = x || 0;
        y = y || 1;
        z = z || 2;
    }

    config.size = config.size || 20;
    config.orient = config.orient || 'horizontal';
    config.startmode = config.startmode || 'day';

    return Object.assign(config, {
        x,
        y,
        z,
        legend
    })
}


let getVisualMap = ({
    y,
    data,
    orient
}) => {
    let key = R.pluck(data.header[y])(data.data);
    let minmax = {
        max: jStat.max(key),
        min: jStat.min(key)
    }
    minmax = util.handleMinMax(minmax);
    return {
        ...minmax,
        type: "piecewise",
        calculable: true,
        orient,
        left: "center",
        top: "bottom",
        inRange: {
            color
        }
    };
}
let getSeries = ({
    data,
    x,
    y,
    legend
}) => {
    let {
        header
    } = data;
    let key = header[y];
    let srcData = [];

    // 数据预处理，只保留需要的x,y,z,legend
    if (R.isNil(legend)) {
        srcData = util.getDataByKeys({
            keys: [header[x], key],
            data: data.data
        });
    };
    srcData = util.getDataByKeys({
        keys: [header[legend], header[x], key],
        data: data.data
    });

    if (R.isNil(legend)) {
        return [{
            data: srcData,
            type: "heatmap",
            coordinateSystem: "calendar",
            calendarIndex: 0
        }];
    };

    let legendData = util.getUniqByIdx({
        key: header[legend],
        data: data.data
    })

    return legendData.map((name, calendarIndex) => {
        let seriesItem = R.filter(R.propEq(0, name))(srcData);
        return {
            name,
            data: seriesItem.map(([, x, y]) => [x, y]),
            type: "heatmap",
            coordinateSystem: "calendar",
            calendarIndex
        }
    });
};

let getCalendar = (config, idx, range, name) => {
    let top = 100 + idx * (6 * config.size + 70);
    return {
        range,
        cellSize: [config.size, config.size],
        orient: config.orient,
        top,
        ...getCalendarStyle(name)
    }
}
let getRange = (data, {
    startmode
}) => {
    let curData = R.pluck(0)(data);
    if (startmode === 'day') {
        curData = R.compose(R.uniq, R.map(R.slice(0, 10)))(curData);
        curData = curData.sort((a, b) => (parseInt(a.replace(/\-/g, '') - parseInt(b.replace(/\-/g, '')))));
        return [R.head(curData), R.last(curData)];
    }

    // 以月为单位 
    curData = R.compose(R.uniq, R.map(R.slice(0, 7)))(curData);
    curData = curData.sort((a, b) => (parseInt(a.replace(/\-/g, '') - parseInt(b.replace(/\-/g, '')))));
    let head = R.head(curData);
    let last = R.last(curData);
    return [moment(head).startOf("month").format('YYYY-MM-DD'), moment(last).endOf("month").format('YYYY-MM-DD')]
}
let calendar = config => {
    config = handleConfig(config);
    let series = getSeries(config);
    let calendar = series.map(({
            data,
            name
        }, idx) => {
            let range = getRange(data, config)
            return getCalendar(config, idx, range, name);
        })
        // let legend = util.getLegend(config, 'multiple');
        // legend.show = false;

    return {
        tooltip: {
            trigger: "item",
            position: 'top',
            formatter: ({
                seriesName,
                value: [datename, val]
            }) => `${seriesName}\n<br>${datename.split(' ')[0]}：${val}`
        },
        legend: {
            show: false
        },
        visualMap: getVisualMap(config),
        calendar,
        series,
    };
}

export {
    calendar
}