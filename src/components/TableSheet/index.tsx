import React, { useState, useEffect, useRef } from 'react';
import 'handsontable/dist/handsontable.full.css';
import { HotTable } from '@handsontable/react';
import 'handsontable/languages/zh-CN';
import * as lib from '@/utils/lib';
import * as R from 'ramda';
import * as setting from '@/utils/setting';
import qs from 'qs';
import chartLib from '@/pages/chart/utils/lib';

export const getFirstRow = data => {
  if (!data.data || !data.data[0]) {
    return [];
  }
  return data.header.map((item, idx) => {
    let row = chartLib.getDataByIdx({
      key: idx,
      data: data.data,
    });
    row = row.filter(item => String(item).trim().length > 0);
    return row[0] || '';
  });
};

/**
 * wiki: https://handsontable.com/docs/7.2.2/Options.html#mergeCells
 */

let colTitles = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const getConfig = (data, afterFilter, sheetHeight) => {
  let firstRow = getFirstRow(data);

  const minCols = 10; // 最少10行
  // console.log(data);
  let columns = (data.header || []).map((title, idx) => {
    let item = firstRow[idx] || '';
    let type = lib.isDate(item)
      ? 'date'
      : lib.isTime(item)
      ? 'time'
      : lib.isNumOrFloat(item)
      ? 'numeric'
      : 'text';
    let column: {
      title: string;
      type: string;
      numericFormat?: {};
      dateFormat?: string;
      allowEmpty?: boolean;
      [key: string]: any;
      //   wordWrap?: boolean;
    } = { title, type };
    if (type === 'numeric') {
      column = {
        ...column,
        numericFormat: {
          pattern: '0,00',
          culture: 'zh-CN',
        },
      };
      if (lib.isFloat(item)) {
        column.renderer = (hotInstance, TD, row, col, prop, value) => {
          TD.innerHTML = value ? Number(Number(value).toFixed(3)) : value || '';
        };
      }
    } else if (type === 'date' || type === 'time') {
      column = {
        ...column,
        dateFormat: 'YYYY-MM-DD',
        allowEmpty: true,
      };
    }

    if (lib.isCartOrReel(item) || (lib.isPlate(item) && !lib.isDate(item))) {
      column.renderer = (hotInstance, TD, row, col, prop, value) => {
        TD.innerHTML = value
          ? `<a href="${setting.searchUrl}${value}" target="_blank" style="text-decoration:none">${value}</a>`
          : '';
      };
    } else if (lib.isUrl(item)) {
      column.renderer = (hotInstance, TD, row, col, prop, value) => {
        TD.innerHTML = value
          ? `<a href="${value}" target="_blank" style="text-decoration:none">${value}</a>`
          : '';
      };
    }

    if (String(item).includes('base64')) {
      column.renderer = (hotInstance, TD, row, col, prop, value) => {
        TD.innerHTML = value ? `<img src="${value}" />` : '';
      };
      column.width = 200;
    }

    if (type === 'time') {
      column.renderer = (hotInstance, TD, row, col, prop, value) => {
        TD.innerHTML = (value || '').split('.')[0];
      };
      column.width = 160;
    } else {
      let wordWidth = lib.getStringWidth(String(item).trim());
      if (wordWidth > 10 && wordWidth < 15) {
        column.width = 200;
      } else if (wordWidth >= 15) {
        column.width = 300;
      }
    }

    return column;
  });

  // 8.0版本中，如果行列数小于数据给出的列数，在处理排序逻辑时，由于未读到 column信息导致报错，此处需删除
  // if (columns.length < minCols) {
  //   let nextCol = R.slice(columns.length, minCols)(colTitles);
  //   columns = [...columns, ...nextCol.map(title => ({ title }))];
  // }

  let isSearch = window.location.pathname.includes('/search');
  let minRows = isSearch ? 13 : 32;

  let config = {
    stretchH: 'all',
    autoWrapRow: true,
    height: sheetHeight || (isSearch ? 300 : `calc( 100vh - ${data.hidemenu ? 150 : 200}px)`), //  data.data.length < 20 ||
    rowHeaders: true,
    colHeaders: data.header,
    columns,
    data: data.data,
    licenseKey: 'non-commercial-and-evaluation',
 
    mergeCells: true,
    manualRowResize: true,
    manualColumnResize: true,
    manualColumnMove: true,
    contextMenu: true,
    filters: true,
    afterFilter,
    dropdownMenu: true,

    trimRows:[],

    multiColumnSorting: {
      sortEmptyCells: true, // true = the table sorts empty cells, false = the table moves all empty cells to the end of the table (by default)
      indicator: true, // true = shows indicator for all columns (by default), false = don't show indicator for columns
      headerAction: true, // true = allow to click on the headers to sort (by default), false = turn off possibility to click on the headers to sort
    },
    
    autoColumnSize: {
      samplingRatio: 23
    },

    // 8.0 报错
    // Plugins `columnSorting` and `multiColumnSorting` should not be enabled simultaneously.
    // columnSorting: {
    //   indicator: true,
    // },

    language: 'zh-CN',
    manualColumnFreeze: true,
    // fragmentSelection: 'cell',
    // disableVisualSelection: true,
    // columnHeaderHeight: 35,
    minCols,
    minRows,
    // rowHeaderWidth: 28,
    search: true,
    undo: true,
    colWidths: 100,
  };
  if (data?.nestedHeaders?.[0]?.[0]) {
    config.nestedHeaders = data.nestedHeaders;
  }

  return config;
};

const getFreeze = () => {
  let param = qs.parse(window.location.hash);
  let freeze = param.freeze || '1';
  return R.range(0, Number(freeze));
};

const TableSheet = ({ data, onFilter, beforeRender, sheetHeight, renderParam = {} }) => {
  const [config, setConfig] = useState({
    licenseKey: 'non-commercial-and-evaluation',
  });

  const hotTable = useRef(null);

  useEffect(() => {
    let hot = hotTable.current.hotInstance;

    // 数据过滤后返回结果，单元格由于可编辑，此处不使用 hot.getData() 拿数据。
    const afterFilter = () => { 
      let arrs = [];// 7.0 适用后面的逻辑 hot.getPlugin('filters').trimRowsPlugin.rowsMapper.__arrayMap;
      
      hot.getPlugin('filters').filtersRowsMap.indexedValues.forEach((item,idx)=>{
        if(item){
          arrs.push(idx)
        }
      })
      onFilter(arrs);
    };

    let cfg = getConfig(data, afterFilter, sheetHeight);

    if (beforeRender) {
      cfg = beforeRender(cfg, renderParam);
    }

    setConfig(cfg); 

    // 冻结指定列
    if (hotTable) {
      let freeze = getFreeze();
      let plugin = hot.getPlugin('ManualColumnFreeze');
      freeze.forEach(idx => {
        plugin.freezeColumn(idx);
      });
      hot.render();
    }

    // let hot = hotTable.current.hotInstance;
    // const filtersPlugin = hot.getPlugin('filters');
    // console.log(filtersPlugin);
  }, [data.hash]);

  return React.useMemo(() => <HotTable ref={hotTable} settings={config} />, [config]);
};

export default TableSheet;
