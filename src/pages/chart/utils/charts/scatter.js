const R = require("ramda");

export const handleScatter = ({
    xAxis,
    series
}, options, data) => {
    let {
        header
    } = data;
    if (R.isNil(options.z)) {
        series = series.map(item => {
            item.symbolSize = R.isNil(options.scattersize) ? 20 : options.scattersize;
            return item;
        })
        return {
            xAxis,
            series
        };
    }

    options.scale = options.scale || 1;

    series = series.map(item => {
        item.data = item.data.map((sData, idx) => {
            let legendName = item.name;
            let xName = R.nth(idx)(xAxis);
            let scatterData = R.find(R.whereEq({
                [header[options.legend]]: legendName,
                [header[options.x]]: xName
            }))(data.data)
            return [xName, sData, options.scale * R.prop(header[options.z])(scatterData)];
        })
        item.symbolSize = data => data[2];
        if (item.data.length > 100) {
            item.large = true;
        }
        return item;
    })
    return {
        xAxis: [],
        series
    };
}