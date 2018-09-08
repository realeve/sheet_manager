const R = require("ramda");

let standardPie = ({ option, config }) => {
  option = Object.assign(option, config);

  R.forEach(key => (option[key] = parseInt(option[key], 10)))(["x", "y"]);

  let { data, header } = config.data;

  if (R.compose((R.equals, R.type, R.nth(0), "Object"))) {
    header = R.map(R.prop("title"))(header);
  }

  // let seriesData = R.map(item => ({
  //   name: R.nth(option.x, item),
  //   value: R.nth(option.y, item)
  // }))(data);

  let seriesData = R.map(item => {
    let [name, value] = [R.nth(option.x, item), R.nth(option.y, item)];
    return { name, value };
  })(data);
  console.log(seriesData);

  let series = [
    {
      name: header[option.x],
      type: "pie",
      radius: option.doughnut ? ["30%", "65%"] : "65%",
      center: ["50%", "50%"],
      selectedMode: "single",
      data: seriesData,
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)"
        }
      }
    }
  ];

  return {
    series,
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
      orient: "vertical",
      x: "right"
    }
  };
};

let pie = config => {
  let option;
  switch (config.data.header.length) {
    case 3:
      // option = {
      //   legend: 0,
      //   x: 1,
      //   y: 2
      // };
      break;
    case 2:
      option = {
        x: 0,
        y: 1
      };
      break;
    default:
      break;
  }
  return standardPie({ config, option });
};

export { pie };
