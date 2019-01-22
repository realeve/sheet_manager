import util from '../lib';
const R = require('ramda');

let chartConfig = [
  {
    key: 'type',
    title: '图表类型',
    default: 'sankey,桑基图，数据结构中前N列为参与可视化的字段，最后一个字段为数据列',
  },
  {
    key: 'sequence',
    title: 'header中各字段序列',
    default: '默认按接口中输出字段的顺序进行，最后一列为数据字段。',
    url: '/chart#id=12/e7d0f080bc&type=sankey&sequence=2,0,1,3,4,5',
  },
  {
    key: 'vertical',
    title: '垂直布局',
    default: '默认:0，水平布局,1:垂直布局',
    url: '/chart#id=12/e7d0f080bc&type=sankey&sequence=2,0,1,3,4,5&vertical=1',
  },
];

const sankey = config => {
  let { data, header } = config.data;
  // let sequence = jStat.arange(header.length)
  if (config.sequence) {
    let sequence = config.sequence.split(',');
    if (sequence.length < header.length) {
      sequence = [...sequence, R.last(header)];
    }
    let _header = sequence.map(idx => header[idx]);
    header = R.clone(_header);
  }

  let sankeySeg = R.init(header);
  let valKey = R.last(header);
  let dataList = [];
  let uniqSeglist = [],
    links = [];

  sankeySeg.forEach(key => {
    let uniqSeg = util.getUniqByIdx({
      key,
      data,
    });
    uniqSeglist.push(uniqSeg);
    uniqSeg = uniqSeg.map(item => (dataList.includes(item) ? `${item}(${key})` : item));
    dataList = [...dataList, ...uniqSeg];
  });

  // 获取结点列表
  dataList = dataList.map(name => ({
    name,
  }));

  uniqSeglist.forEach((curNode, i) => {
    if (i === sankeySeg.length - 1) {
      return;
    }
    let nextNode = uniqSeglist[i + 1];
    let curSeg = header[i];
    let nextSeg = header[i + 1];

    curNode.forEach(source => {
      nextNode.forEach(target => {
        let curData = R.compose(
          R.pluck(valKey),
          R.filter(
            R.whereEq({
              [curSeg]: source,
              [nextSeg]: target,
            })
          )
        )(data);
        links.push({
          source,
          target,
          value: R.sum(curData),
        });
      });
    });
  });
  let orient = config.vertical ? 'vertical' : 'horizontal';
  return {
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove',
    },
    series: [
      {
        orient,
        type: 'sankey',
        layout: 'none',
        focusNodeAdjacency: false, //'allEdges',
        data: dataList,
        links,
        itemStyle: {
          normal: {
            borderWidth: 1,
            borderColor: '#aaa',
          },
        },
        label: {
          position: orient === 'vertical' ? 'top' : 'right',
        },
        lineStyle: {
          normal: {
            color: 'source',
            curveness: 0.5,
          },
        },
      },
    ],
  };
};

export { sankey, chartConfig };
