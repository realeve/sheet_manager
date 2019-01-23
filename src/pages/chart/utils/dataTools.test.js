import dataTool from './dataTool';
// const gexfData = `<?xml version="1.0" encoding="UTF-8"?>
// <gexf xmlns="http://www.gexf.net/1.2draft" version="1.2" xmlns:viz="http://www.gexf.net/1.2draft/viz" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.gexf.net/1.2draft http://www.gexf.net/1.2draft/gexf.xsd">
//   <meta lastmodifieddate="2014-01-30">
//     <creator>Gephi 0.8.1</creator>
//     <description></description>
//   </meta>
//   <graph defaultedgetype="undirected" mode="static">
//     <attributes class="node" mode="static">
//       <attribute id="modularity_class" title="Modularity Class" type="integer"></attribute>
//     </attributes>
//     <nodes>
//       <node id="0" label="Myriel">
//         <attvalues>
//           <attvalue for="modularity_class" value="0"></attvalue>
//         </attvalues>
//         <viz:size value="28.685715"></viz:size>
//         <viz:position x="-266.82776" y="299.6904" z="0.0"></viz:position>
//         <viz:color r="235" g="81" b="72"></viz:color>
//       </node>
//       <node id="1" label="Napoleon">
//         <attvalues>
//           <attvalue for="modularity_class" value="0"></attvalue>
//         </attvalues>
//         <viz:size value="4"></viz:size>
//         <viz:position x="-418.08344" y="446.8853" z="0.0"></viz:position>
//         <viz:color r="236" g="81" b="72"></viz:color>
//       </node>
//     </nodes>
//     <edges>
//       <edge id="0" source="1" target="0">
//         <attvalues></attvalues>
//       </edge>
//       <edge id="1" source="2" target="0" weight="8.0">
//         <attvalues></attvalues>
//       </edge>
//     </edges>
//   </graph>
// </gexf>
// `;

// test('gexf', () => {
//   const res = {
//     links: [
//       { id: '0', lineStyle: { normal: {} }, name: null, source: '1', target: '0' },
//       { id: '1', lineStyle: { normal: {} }, name: null, source: '2', target: '0' },
//     ],
//     nodes: [
//       {
//         attributes: { modularity_class: 0 },
//         id: '0',
//         itemStyle: { normal: { color: 'rgb(235,81,72)' } },
//         name: 'Myriel',
//         symbolSize: 28.685715,
//         x: -266.82776,
//         y: 299.6904,
//       },
//       {
//         attributes: { modularity_class: 0 },
//         id: '1',
//         itemStyle: { normal: { color: 'rgb(236,81,72)' } },
//         name: 'Napoleon',
//         symbolSize: 4,
//         x: -418.08344,
//         y: 446.8853,
//       },
//     ],
//   };
//   expect(dataTool.gexf.parse(gexfData)).toMatchObject(res);

//   let parser = new DOMParser();
//   let xmlData = parser.parseFromString(gexfData, 'text/xml');
//   expect(dataTool.gexf.parse(xmlData)).toMatchObject(res);

//   expect(dataTool.gexf.parse('')).toBeNull();
//   expect(dataTool.gexf.parse('<?xml version="1.0"')).toBeNull();
// });

// test('datatool.map', () => {
//   expect(dataTool.map(null, null)).toBeUndefined();

//   let parser = new DOMParser();
//   let xmlData = parser.parseFromString(gexfData, 'text/xml');
//   let gexfRoot = dataTool.getChildByTagName(xmlData, 'gexf');
//   let graphRoot = dataTool.getChildByTagName(gexfRoot, 'graph');
//   let nodesRoot = dataTool.getChildByTagName(graphRoot, 'nodes');
//   let nodeList = dataTool.getChildByTagName(nodesRoot, 'node');

//   console.log(nodeList);
//   console.log(dataTool.map(nodeList, console.log));
// });

test('数据处理工具', () => {
  expect(dataTool.prepareBoxplotData([[1, 2, 3, 4, 5, 20]])).toMatchObject({
    boxData: [[1, 2.25, 3.5, 4.75, 8.5]],
    outliers: [[0, 20]],
    axisData: ['0'],
  });

  // layout,boundIQR
  expect(
    dataTool.prepareBoxplotData([[1, 2, 3, 4, 5, 20]], {
      boundIQR: 1.5,
      layout: 'vertical',
    })
  ).toMatchObject({
    boxData: [[1, 2.25, 3.5, 4.75, 8.5]],
    outliers: [[0, 20].reverse()],
    axisData: ['0'],
  });

  // useExtreme
  expect(
    dataTool.prepareBoxplotData([[1, 2, 3, 4, 5, 20]], {
      boundIQR: 0,
    })
  ).toMatchObject({
    boxData: [[1, 2.25, 3.5, 4.75, 20]],
    outliers: [],
    axisData: ['0'],
  });
});

test('quantile(array, p) requires sorted numeric input', () => {
  expect(dataTool.quantile([1, 2, 3, 4], 0)).toBe(1);
  expect(dataTool.quantile([1, 2, 3, 4], 1)).toBe(4);
  expect(dataTool.quantile([4, 3, 2, 1], 0)).toBe(4);
  expect(dataTool.quantile([4, 3, 2, 1], 1)).toBe(1);
});
