import React from 'react';
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
const TableSheet = ({ data }) => {
  let firstRow = data.data[0] || [];
  const minCols = 10; // 最少10行

  let columns = data.header.map((title, idx) => {
    let item = firstRow[idx];
    let type = lib.isDateTime(item) ? 'date' : lib.isNumOrFloat(item) ? 'numeric' : 'text';
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
    } else if (type === 'date') {
      column = {
        ...column,
        dateFormat: 'YYYYMMDD',
        allowEmpty: true,
      };
    }
    if (lib.isCartOrReel(item)) {
      column.renderer = (hotInstance, TD, row, col, prop, value) => {
        TD.innerHTML = `<a href="${setting.searchUrl}${value}" target="_blank" style="text-decoration:none">${value}</a>`;
      };
    }
    return column;
  });

  if (columns.length < minCols) {
    let nextCol = R.slice(columns.length, minCols)(colTitles);
    columns = [...columns, ...nextCol.map(title => ({ title }))];
  }

  let config = {
    stretchH: 'all',
    autoWrapRow: true,
    height: `calc( 100vh - ${data.hidemenu ? 240 : 320}px)`,
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
    minRows: 31,
    // rowHeaderWidth: 28,
    search: true,
    undo: true,
    colWidths: 100,
  };
  if (data.nestedHeaders) {
    config.nestedHeaders = data.nestedHeaders;
  }
  return <HotTable settings={config} />;
};

export default TableSheet;
