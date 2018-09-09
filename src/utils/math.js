const R = require('ramda');

export const dataOperator = [{
        label: "汇总",
        value: 0
    },
    {
        label: "计数",
        value: 1
    },
    {
        label: "平均值",
        value: 2
    },
    {
        label: "最大值",
        value: 3
    },
    {
        label: "最小值",
        value: 4
    },
    {
        label: "中位数",
        value: 5
    }
];

const group = (array, f) => {
    let groups = {};
    array.forEach((o) => {
        let group = JSON.stringify(f(o));
        groups[group] = groups[group] || [];
        groups[group].push(o);
    });
    return R.values(groups);
}

// 对数据做 数据库层面的  group 计算操作
export const groupBy = keys => arr => group(arr, R.pick(keys));

export const restoreDataSrc = dataSrc => {
    let _dataSrc = R.clone(dataSrc);
    let {
        data,
        header
    } = _dataSrc;
    data = R.map(item => {
        delete item['key'];
        let values = R.values(item)
        let obj = {}
        header.forEach((key, id) => {
            obj[key] = values[id];
        });
        return obj;
    })(data);
    return Object.assign(_dataSrc, {
        data
    });
}

const getSrcHeaderName = (arr, header) => R.values(R.pick(arr)(header));
const getOperatorHeader = (arr, operatorLabel) => {
    let res = arr.map(fields => operatorLabel.map(({
        label,
        value
    }) => ({
        fields,
        header: `${fields}(${label})`,
        calcType: value
    })));
    return R.flatten(res)
}

export const groupArr = ({
    groupFields,
    calFields,
    dataSrc,
    operatorList
}) => {
    let {
        header,
        data
    } = dataSrc;

    let fields = R.concat(groupFields, calFields);


    let calFieldHeader = getSrcHeaderName(calFields, header);
    let headerFields = getSrcHeaderName(fields, header);
    groupFields = getSrcHeaderName(groupFields, header);

    data = R.map(item => R.pick(headerFields)(item))(data);
    data = groupBy(calFieldHeader)(data);

    let operatorLabel = R.map(id => dataOperator[id])(operatorList)

    console.log(groupFields, calFields)
    let operatorHeader = getOperatorHeader(groupFields.length > 0 ? groupFields : calFields, operatorLabel);
    console.log(operatorHeader)
    let _header = R.clone(calFieldHeader);
    // 计算新的header信息
    operatorHeader.forEach(({
        header
    }) => {
        _header.push(header)
    })

    let calData = data.map(item => handleDataItem(item, operatorHeader, calFieldHeader))
    calData = R.flatten(calData);
    let rows = calData.length;

    // 将数据中的对象重新转换为数组
    calData = calData.map(item => _header.map(key => item[key]))

    return Object.assign({}, dataSrc, {
        data: calData,
        header: _header,
        rows
    })
}

const handleDataItem = (data, operator, calFields) => {
    let result = R.pick(calFields)(data[0]);
    let cachedColName = R.uniq(getCol(operator, ['fields']));
    let cache = {};
    cachedColName.forEach(col => {
        cache[col] = getCol(data, [col])
    });
    operator.forEach(({
        fields,
        header,
        calcType
    }) => {
        let cacheItem = cache[fields];
        console.log(cacheItem);

        let res = '';
        switch (calcType) {
            case 0:
                res = getSum(cacheItem);
                break;
            case 1:
                res = getCount(cacheItem)
                break;
            case 2:
                res = getMean(cacheItem)
                break;
            case 3:
                res = getMax(cacheItem)
                break;
            case 4:
                res = getMin(cacheItem)
                break;
            case 5:
            default:
                res = getMedian(cacheItem)
                break;
        }
        result[header] = res;
    })
    return result;
}

let getCol = (data, col) => {
    let res = R.map(R.pick(col))(data)
    res = R.map(R.values)(res)
    return R.flatten(res);
}

let getSum = data => R.reduce(R.add, 0)(data);
let getCount = data => data.length;
let getMax = data => R.reduce(R.max, data[0])(data);
let getMin = data => R.reduce(R.min, data[0])(data);
let getMean = data => R.mean(data);
let getMedian = data => R.median(data)