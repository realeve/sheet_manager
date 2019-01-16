import React from 'react';
import * as table from './table';
import { shallow } from 'enzyme';
import * as setting from '../utils/setting';
// const prettyFormat = require('pretty-format');

const { searchUrl } = setting;
const resultObj = [{ dataIndex: 'col0', title: 'a' }, { dataIndex: 'col1', title: 'b' }];
const dataSrc = {
  data: [
    {
      col0: 1,
      col1: 2,
      key: 0,
    },
    {
      col0: 3,
      col1: 4,
      key: 1,
    },
  ],
  rows: 2,
  header: ['a', 'b'],
};
test('是否为数据过滤列', () => {
  // 无数据
  expect(table.handleColumns({ dataSrc: {}, filteredInfo: {} })).toEqual([]);

  expect(table.handleColumns({ dataSrc: { rows: 0 }, filteredInfo: {} }, searchUrl)).toEqual([]);

  // 未设置默认url
  expect(table.handleColumns({ dataSrc: { rows: 0 }, filteredInfo: {} })).toHaveLength(0);

  // 未设置data
  expect(
    table.handleColumns({
      dataSrc,
      filteredInfo: {},
    })
  ).toMatchObject(resultObj);

  let res = table.handleColumns({ dataSrc, filteredInfo: {} }, searchUrl);
  expect(res).toMatchObject(resultObj);
  expect(res[0].render(2233)).toBe('2,233');

  // 测试排序
  expect(
    res[0].sorter(
      {
        col0: 3,
        col1: 2,
      },
      {
        col0: 1,
        col1: 4,
      }
    )
  ).toBe(2);
});

test('空值', () => {
  let res = table.handleColumns(
    {
      dataSrc: {
        data: [
          {
            col0: null,
            col1: 2,
            key: 0,
          },
          {
            col0: null,
            col1: 4,
            key: 1,
          },
        ],
        rows: 2,
        header: ['a', 'b'],
      },
      filteredInfo: {},
    },
    searchUrl
  );
  expect(res).toMatchObject(resultObj);
});

test('时间日期', () => {
  let res = table.handleColumns(
    {
      dataSrc: {
        data: [
          {
            col0: '2018-12-21 22:00:00',
            col1: 2,
            key: 0,
          },
          {
            col0: '2018-12-21 22:00:00',
            col1: 4,
            key: 1,
          },
        ],
        rows: 2,
        header: ['a', 'b'],
      },
      filteredInfo: {},
    },
    searchUrl
  );
  expect(res).toMatchObject(resultObj);
  res = table.handleColumns(
    {
      dataSrc: {
        data: [
          {
            col0: '',
            col1: 2,
            key: 0,
          },
          {
            col0: '',
            col1: 4,
            key: 1,
          },
        ],
        rows: 2,
        header: ['a', 'b'],
      },
      filteredInfo: {},
    },
    searchUrl
  );
  expect(res).toMatchObject(resultObj);
  expect(res[0].render(null)).toBe('');
});

test('超过10列数据', () => {
  let res = table.handleColumns(
    {
      dataSrc: {
        data: [
          {
            col0: 1,
            col1: 2,
            col2: 2,
            col3: 2,
            col4: 2,
            col5: 2,
            col6: 2,
            col7: 2,
            col8: 2,
            col9: 2,
            col10: 2,
            col11: 2,
            key: 0,
          },
        ],
        rows: 2,
        header: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'],
      },
      filteredInfo: {},
    },
    searchUrl
  );
  expect(res).toMatchObject([
    { dataIndex: 'col0', title: 'a' },
    { dataIndex: 'col1', title: 'b' },
    { dataIndex: 'col2', title: 'c' },
    { dataIndex: 'col3', title: 'd' },
    { dataIndex: 'col4', title: 'e' },
    { dataIndex: 'col5', title: 'f' },
    { dataIndex: 'col6', title: 'g' },
    { dataIndex: 'col7', title: 'h' },
    { dataIndex: 'col8', title: 'i' },
    { dataIndex: 'col9', title: 'j' },
    { dataIndex: 'col10', title: 'k' },
  ]);
});

test('小数点', () => {
  const dataSrc = {
    data: [
      {
        col0: 2.2,
        col1: 2,
      },
      {
        col0: 2.3,
        col1: 4,
      },
    ],
    rows: 2,
    header: ['a', 'b'],
  };
  const res = table.handleColumns({ dataSrc, filteredInfo: {} }, searchUrl);
  expect(res[0].render(2.338)).toBe(2.338);
  expect(res[0].render(-2.338)).toBe(-2.338);
  expect(res[0].render(+2.338)).toBe(2.338);
});

test('车号与轴号渲染', () => {
  const dataSrc = {
    data: [
      {
        col0: '1820A233',
        col1: 2,
        key: 0,
      },
      {
        col0: '1820A234',
        col1: 4,
        key: 1,
      },
    ],
    rows: 2,
    header: ['a', 'b'],
  };
  const res = table.handleColumns({ dataSrc, filteredInfo: {} }, searchUrl);

  // 第0个节点渲染正常
  let wrapper = shallow(res[0].render('1820A122'));
  expect(wrapper.text().trim()).toBe('1820A122');
  expect(wrapper.prop('href')).toBe(searchUrl + '1820A122');
  expect(wrapper.prop('target')).toBe('_blank');
});

test('未传入data', () => {
  const dataSrc = {
    rows: 2,
    header: ['a', 'b'],
  };
  const res = table.handleColumns({ dataSrc, filteredInfo: {} }, searchUrl);
  expect(res).toEqual([{ dataIndex: 'col0', title: 'a' }, { dataIndex: 'col1', title: 'b' }]);
});

test('img渲染', () => {
  const dataSrc = {
    data: [
      {
        col0: 'image/url.jpg',
        col1: 2,
      },
      {
        col0: 'image/url.jpg',
        col1: 4,
      },
    ],
    rows: 2,
    header: ['a', 'b'],
  };
  const res = table.handleColumns({ dataSrc, filteredInfo: {} }, searchUrl);

  // image
  let wrapper = shallow(res[0].render('image/url.jpg'));
  expect(wrapper.text().trim()).toBe('');
  expect(wrapper.prop('src')).toBe(`${setting.uploadHost}image/url.jpg`);
  expect(wrapper.prop('alt')).toBe('image/url.jpg');

  // file
  wrapper = shallow(res[0].render('/file/url.pdf'));
  expect(wrapper.prop('src')).toBe(`${setting.uploadHost}/file/url.pdf`);
  expect(wrapper.prop('alt')).toBe('/file/url.pdf');

  // base64
  wrapper = shallow(res[0].render('data:image/png;base64'));
  expect(wrapper.prop('src')).toBe('data:image/png;base64');
  expect(wrapper.prop('alt')).toBe('data:image/png;base64');

  // other
  expect(res[0].render('/video/url.mp4')).toBe('/video/url.mp4');
});

test('分页', () => {
  expect(table.getPageData({ data: [1, 2, 3, 4, 5, 6], page: 2, pageSize: 2 })).toEqual([3, 4]);
});

test('初始化数据', () => {
  expect(table.handleSrcData([])).toEqual([]);

  expect(
    table.handleSrcData({
      data: [[1, 2], [3, 4]],
      rows: 2,
      header: ['a', 'b'],
    })
  ).toEqual({
    data: [{ col0: 1, col1: 1, col2: 2, key: 0 }, { col0: 2, col1: 3, col2: 4, key: 1 }],
    header: ['', 'a', 'b'],
    rows: 2,
  });

  expect(
    table.handleSrcData({
      data: [],
      rows: 0,
      header: ['a', 'b'],
    })
  ).toEqual({
    data: [],
    header: ['', 'a', 'b'],
    rows: 0,
  });
});

test('updateState', () => {
  let resObj = {
    bordered: true,
    columns: resultObj,
    dataClone: [{ col0: 1, col1: 2, key: 0 }, { col0: 3, col1: 4, key: 1 }],
    dataSearchClone: [],
    dataSource: [{ col0: 1, col1: 2, key: 0 }, { col0: 3, col1: 4, key: 1 }],
    dataSrc: {
      data: [{ col0: 1, col1: 2, key: 0 }, { col0: 3, col1: 4, key: 1 }],
      header: ['a', 'b'],
      rows: 2,
      source: 'source',
      time: '1ms',
    },
    loading: true,
    source: 'source',
    timing: '1ms',
    total: 2,
  };

  let params = {
    dataSrc: {
      ...dataSrc,
      source: 'source',
      time: '1ms',
    },
    loading: true,
  };
  window.localStorage.setItem('_tbl_bordered', '1');
  let res = table.updateState(params, { page: 1, pageSize: 2 });
  expect(res).toMatchObject(resObj);

  window.localStorage.setItem('_tbl_bordered', '0');
  res = table.updateState(params, { page: 1, pageSize: 2 });
  expect(res).toMatchObject(Object.assign(resObj, { bordered: false }));

  // 如果数据未做原始转换
  res = table.updateState(
    {
      dataSrc: {
        data: [[1, 2], [3, 4]],
        rows: 2,
        header: ['a', 'b'],
        source: 'source',
        time: '1ms',
      },
      loading: true,
    },
    { page: 1, pageSize: 2 }
  );
  expect(res).toMatchObject(resObj);

  res = table.updateState(
    {
      dataSrc: {
        ...dataSrc,
        source: 'source',
        time: '1ms',
        rows: 0,
      },
      loading: true,
    },
    { page: 1, pageSize: 2 }
  );
  const emptyObj = {
    bordered: false,
    columns: [],
    dataClone: [{ col0: 1, col1: 2, key: 0 }, { col0: 3, col1: 4, key: 1 }],
    dataSearchClone: [],
    dataSource: [],
    dataSrc: {
      data: [{ col0: 1, col1: 2, key: 0 }, { col0: 3, col1: 4, key: 1 }],
      header: ['a', 'b'],
      rows: 0,
      source: 'source',
      time: '1ms',
    },
    loading: true,
    source: 'source',
    timing: '1ms',
    total: 0,
  };
  expect(res).toMatchObject(emptyObj);

  res = table.initState({
    dataSrc: {
      ...dataSrc,
      source: 'source',
      time: '1ms',
      rows: 0,
    },
    loading: true,
  });
  expect(res).toMatchObject(emptyObj);
});

test('数据排序', () => {
  let params = {
    dataClone: [{ col0: 1, col1: 2 }, { col0: 3, col1: 4 }],
    field: 'col1',
  };
  expect(table.handleSort({ ...params, order: 'descend' })).toEqual([
    { col0: 3, col1: 4 },
    { col0: 1, col1: 2 },
  ]);
  expect(table.handleSort({ ...params, order: 'ascend' })).toEqual([
    { col0: 1, col1: 2 },
    { col0: 3, col1: 4 },
  ]);
});

test('数据过滤', () => {
  let data = [{ col0: 1, col1: 2 }, { col0: 3, col1: 4 }];
  let params = {
    data,
    filters: {
      col0: [3],
    },
  };
  expect(table.handleFilter(params)).toEqual([{ col0: 3, col1: 4 }]);
  params = {
    data,
    filters: {
      col0: [],
    },
  };
  expect(table.handleFilter(params)).toEqual(data);

  let filterData = [
    {
      col0: '9602A',
      col1: 2,
      key: 0,
    },
    {
      col0: '9603A',
      col1: 4,
      key: 1,
    },
  ];
  let res = table.handleColumns(
    {
      dataSrc: {
        data: filterData,
        rows: 2,
        header: ['a', 'b'],
      },
      filteredInfo: {},
    },
    searchUrl
  );
  let { onFilter } = res[0];
  expect(onFilter('9602A', filterData[0])).toBeTruthy();
  expect(onFilter('9602A', filterData[1])).toBeFalsy();
});

test('更新数据列', () => {
  let params = {
    columns: [
      {
        dataIndex: 'col0',
        a: 1,
      },
      {
        dataIndex: 'col1',
        a: 2,
      },
    ],
    filters: {
      col0: [3],
    },
  };
  expect(table.updateColumns(params)).toEqual([
    { a: 1, dataIndex: 'col0', filteredValue: [3] },
    { a: 2, dataIndex: 'col1' },
  ]);
});
