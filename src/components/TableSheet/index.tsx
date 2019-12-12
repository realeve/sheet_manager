import React, { useState, useEffect } from 'react';
import 'handsontable/dist/handsontable.full.css';
import { HotTable } from '@handsontable/react';
import 'handsontable/languages/zh-CN';
import * as lib from '@/utils/lib';
import * as R from 'ramda';
import * as setting from '@/utils/setting';
/**
 * wiki: https://handsontable.com/docs/7.2.2/Options.html#mergeCells
 */

let colTitles = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const getConfig = data => {
  let firstRow = (data.data && data.data[0]) || [];
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
          TD.innerHTML = value ? Number(Number(value).toFixed(3)) : value;
        };
      }
    } else if (type === 'date' || type === 'time') {
      column = {
        ...column,
        dateFormat: 'YYYY-MM-DD',
        allowEmpty: true,
      };
    }
    if (type === 'time') {
      column.renderer = (hotInstance, TD, row, col, prop, value) => {
        TD.innerHTML = (value || '').split('.')[0];
      };
      column.width = 160;
    }
    if (lib.isCartOrReel(item)) {
      column.renderer = (hotInstance, TD, row, col, prop, value) => {
        TD.innerHTML = `<a href="${setting.searchUrl}${value}" target="_blank" style="text-decoration:none">${value}</a>`;
      };
    }
    if (String(item).includes('base64')) {
      column.renderer = (hotInstance, TD, row, col, prop, value) => {
        TD.innerHTML = `<img src="${value}" />`;
      };
      column.width = 200;
    }

    return column;
  });

  if (columns.length < minCols) {
    let nextCol = R.slice(columns.length, minCols)(colTitles);
    columns = [...columns, ...nextCol.map(title => ({ title }))];
  }
  let isSearch = window.location.pathname.includes('/search');
  let minRows = isSearch ? 13 : 31;
  let config = {
    stretchH: 'all',
    autoWrapRow: true,
    height: isSearch ? 250 : `calc( 100vh - ${data.hidemenu ? 220 : 270}px)`,
    rowHeaders: true,
    colHeaders: data.header,
    columns,
    data: data.data,
    licenseKey: 'non-commercial-and-evaluation',
    columnSorting: {
      indicator: true,
    },
    autoColumnSize: {
      samplingRatio: 23,
    },
    mergeCells: true,
    manualRowResize: true,
    manualColumnResize: true,
    manualColumnMove: true,
    contextMenu: true,
    filters: true,
    dropdownMenu: true,
    multiColumnSorting: {
      indicator: true,
    },
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
  if (data.nestedHeaders && data.nestedHeaders[0] && data.nestedHeaders[0][0]) {
    config.nestedHeaders = data.nestedHeaders;
  }

  return config;
};

const TableSheet = ({ data }) => {
  const [config, setConfig] = useState({
    licenseKey: 'non-commercial-and-evaluation',
  });
  // const [hash, setHash] = useState('');
  useEffect(() => {
    // if (hash === data.hash) {
    //   return;
    // }
    // setHash(data.hash);
    let cfg = getConfig(data);
    setConfig(cfg);
  }, [data.hash]);

  return React.useMemo(() => <HotTable settings={config} />, [config]);
};

export default TableSheet;
