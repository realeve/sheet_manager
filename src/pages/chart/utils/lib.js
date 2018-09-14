import gColor from "./charts/gColor";
const R = require("ramda");

// let uniq = arr => Array.from(new Set(arr));

let uniq = arr => R.uniq(arr);

let getCopyRight = () => {
    return {
        text: "©xx有限公司 xx部",
        borderColor: "#999",
        borderWidth: 0,
        textStyle: {
            fontSize: 10,
            fontWeight: "normal"
        },
        x: "right",
        y2: 3
    };
};

let handleDefaultOption = (option, config) => {
    option = Object.assign({
            toolbox: {},
            tooltip: {},
            legend: {},
            title: [{
                    left: "center",
                    text: config.data.title
                },
                {
                    text: config.data.source,
                    borderWidth: 0,
                    textStyle: {
                        fontSize: 10,
                        fontWeight: "normal"
                    },
                    x: 5,
                    y2: 0
                },
                {
                    text: `统计时间：${config.dateRange[0]} - ${config.dateRange[1]}`,
                    borderWidth: 0,
                    textStyle: {
                        fontSize: 10,
                        fontWeight: "normal"
                    },
                    x: 5,
                    y2: 18
                },
                getCopyRight()
            ]
        },
        option
    );

    if (["bar", "histogram", "line"].includes(config.type)) {
        let axisPointerType = "shadow";
        let tooltipTrigger = "axis";
        switch (config.type) {
            case "bar":
            case "histogram":
                axisPointerType = "shadow";
                break;
            case "line":
                axisPointerType = "cross";
                break;
            default:
                tooltipTrigger = "item";
                axisPointerType = "cross";
                break;
        }
        option.tooltip = {
            trigger: tooltipTrigger,
            axisPointer: {
                type: axisPointerType
            }
        };
    }

    return option;
};

// 字符串转日期
let str2Date = str => {
    let needConvert = /^[1-9]\d{3}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$|^[1-9]\d{3}(0[1-9]|1[0-2])$/.test(
        str
    );
    if (!needConvert) {
        return str;
    }
    let dates = [str.substr(0, 4), str.substr(4, 2)];
    if (str.length === 8) {
        dates[2] = str.substr(6, 2);
    }
    return dates.join("-");
};

let str2Num = str => {
    if (/^(|\-)[0-9]+.[0-9]+$/.test(str)) {
        return parseFloat(parseFloat(str).toFixed(3));
    }
    if (/^(|\-)[0-9]+$/.test(str)) {
        return parseInt(str, 10);
    }
};

let isDate = dateStr => {
    return /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])|^[1-9]\d{3}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/.test(
        dateStr
    );
};

let needConvertDate = dateStr => {
    return /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])|^[1-9]\d{3}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$|^[1-9]\d{3}(0[1-9]|1[0-2])$/.test(
        dateStr
    );
};

let getDataByIdx = ({
    key,
    data
}) => R.pluck(key)(data);

let getUniqByIdx = ({
    key,
    data
}) => R.uniq(getDataByIdx({
    key,
    data
}));

export default {
    isDate,
    needConvertDate,
    uniq,
    getCopyRight,
    handleDefaultOption,
    str2Date,
    str2Num,
    handleColor: gColor.handleColor,
    getUniqByIdx,
    getDataByIdx
};