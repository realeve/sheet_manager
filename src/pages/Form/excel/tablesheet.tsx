import React, { useState, useEffect, useRef } from 'react';
import 'handsontable/dist/handsontable.full.css';
import { HotTable } from '@handsontable/react';
import 'handsontable/languages/zh-CN';

let colTitles = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

/**
 * 
  hot.updateSettings({
    contextMenu: true,
    colHeaders: true,
    fixedRowsTop: 2
  });

 * wiki: https://handsontable.com/docs/8.0.0/Core.html#updateSettings
 */
const getConfig = (data, sheetHeight, { maxrow, maxcol }) => ({
  stretchH: 'all',
  autoWrapRow: true,
  height: sheetHeight || `calc( 100vh - ${data.hidemenu ? 150 : 200}px)`,
  rowHeaders: true,
  colHeaders: [],
  columns: data.head || colTitles.slice(0, maxcol),
  data: [],
  licenseKey: 'non-commercial-and-evaluation',

  manualRowResize: true,
  manualColumnResize: true,
  contextMenu: true,

  autoColumnSize: {
    samplingRatio: 23,
  },
  minRows: maxrow,
  minCols: maxcol,
  language: 'zh-CN',
  mergeCells: true,
  colWidths: 80,
});

const TableSheet = ({
  sheetHeight,
  maxrow = 32,
  maxcol = 10,
  data = {},
  beforeRender = null,
  renderParam = {},
  onRender = null,
}) => {
  const [config] = useState();
  const hotTable = useRef(null);

  useEffect(() => {
    let hot = hotTable.current.hotInstance;
    onRender && onRender(hot);
  }, []);

  useEffect(() => {
    let _sheetHeight = sheetHeight || 24 * maxrow + 25;
    let cfg = getConfig(data, _sheetHeight, { maxrow, maxcol });
    if (beforeRender) {
      cfg = beforeRender(cfg, renderParam);
    }
    let hot = hotTable.current.hotInstance;
    hot.updateSettings(cfg);
  }, [maxrow, maxcol, sheetHeight]);

  return (
    <HotTable
      ref={hotTable}
      settings={{
        licenseKey: 'non-commercial-and-evaluation',
      }}
    />
  );
};

export default TableSheet;