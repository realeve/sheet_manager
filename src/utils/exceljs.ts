import Excel from 'exceljs/dist/es5/exceljs.browser.js';
import { saveAs } from 'file-saver';
import * as R from 'ramda';
import jStat from 'jStat';
import lib from '@/pages/chart/utils/lib';
import * as utils from './lib';
import { AUTHOR, config, company } from './setting';
import { getParams, Config, BasicConfig, DstConfig } from './excelConfig';
import { getStringWidth, getTableExtraLabel } from '@/utils/lib';

const initWorkSheet = (config: Config) => {
  let workbook = new Excel.Workbook(config);

  workbook.title = company + config.filename.replace('.xlsx', '');
  workbook.creator = config.creator;
  workbook.lastModifiedBy = config.creator;
  workbook.created = new Date();
  workbook.modified = new Date();
  workbook.lastPrinted = new Date();
  workbook.company = AUTHOR.split(' ')[0];
  workbook.subject = document.title; // 来源于某系统
  workbook.comments = config.source;

  // Set workbook dates to 1904 date system
  workbook.properties.date1904 = true;
  workbook.views = [
    {
      firstSheet: 0,
      activeTab: 1,
      visibility: 'visible',
    },
  ];

  let totalLevel = getHeadLevel(config.columns);

  // 冻结行列
  const ySplit = config.params.merge.length ? totalLevel : 1;
  const xSplit = config.params.autoid ? 2 : 1;

  let worksheet = workbook.addWorksheet('Sheet1', {
    properties: { showGridLines: false },
    views: [{ state: 'frozen', xSplit, ySplit, activeCell: 'A1' }],
    pageSetup: {
      paperSize: 9, //'A4'
      margins: {
        left: 0.7,
        right: 0.7,
        top: 0.75,
        bottom: 0.75,
        header: 0.3,
        footer: 0.3,
      },
    },
  });

  // 隐藏网格线
  worksheet.properties.showGridLines = false;

  return { worksheet, workbook };
};

// 处理行高，行宽
export const getColumn = config => {
  return R.clone(config.header).map((header, key) => {
    let rows = lib.getUniqByIdx({ key, data: config.body });
    let wordLength = R.compose(
      R.max(getStringWidth(header)),
      jStat.max,
      R.map(getStringWidth)
    )(rows);

    return { header, width: Math.min(wordLength * 2.3, 50) };
  });
};

export const getHeadLevel = (columns, level = 1) => {
  let curLevel = 1;
  columns.forEach(column => {
    let tempLevel = level;
    if (column.children) {
      tempLevel++;
      tempLevel = getHeadLevel(column.children, tempLevel);
    }
    curLevel = Math.max(curLevel, tempLevel);
  });
  return Math.max(curLevel, level);
};

// 根据一组合并单元格获取需要合并的起始列
let getRowStartAndEnd = (column, { min, max }) => {
  if (column.dataIndex) {
    min = Number(column.dataIndex.replace('col', ''));
    return { min, max: min };
  }
  if (column.children) {
    let res = getRowStartAndEnd(column.children, { min, max });
    min = Math.min(res.min, min);
    max = Math.max(res.max, max);
  } else {
    let first = R.head(column);
    let last = R.last(column);
    if (first.children) {
      let res2 = getRowStartAndEnd(first.children, { min, max });
      min = Math.min(res2.min, min);
      max = Math.max(res2.max, max);
      if (last.children) {
        res2 = getRowStartAndEnd(last.children, { min, max });
        min = Math.min(res2.min, min);
        max = Math.max(res2.max, max);
      }
    } else {
      min = Math.min(first.dataIndex.replace('col', ''), min);
      max = Math.max(last.dataIndex.replace('col', ''), max);
    }
  }
  return {
    min,
    max,
  };
};

// 处理原始列信息，用于数据合并指引
let handleSrcColumn = (src, totalLevel, parentRow = 1) =>
  src.map(item => {
    item.rowId = parentRow;

    // 获取当前行信息
    if (item.children) {
      // 下一级
      item.children = handleSrcColumn(item.children, totalLevel, parentRow + 1);
    } else {
      item.rowEndId = totalLevel;
    }

    // 获取合并列信息
    let { min, max } = getRowStartAndEnd([item], { min: Infinity, max: 0 });
    let rowInfo = R.pick(['rowId', 'rowEndId', 'title', 'children', 'dataIndex'])(item);
    item = { min: min + 1, max: max + 1, ...rowInfo };
    return item;
  });

// 合并列信息
const mergeRowInfo = (worksheet, config) => {
  let totalLevel = getHeadLevel(config.columns);
  // 获取各行列的合并结果;
  let mergeSetting = handleSrcColumn(R.clone(config.columns), totalLevel);
  mergeRowWithWorksheet(mergeSetting, worksheet, config.extra);

  // 处理前两行表头
  if (config.extra.rows) {
    let maxColumns = config.header.length;
    // 全并首行，第二行
    mergeRowByIdx(worksheet, 1, maxColumns, company + config.filename.replace('.xlsx', ''));
    let text = getTableExtraLabel(config.extra).join('          ');
    mergeRowByIdx(worksheet, 2, maxColumns, text);

    let row = worksheet.getRow(1);
    row.height = 40;
    // row.font = {
    //   size: 20,
    //   bold: true,
    // };

    row = worksheet.getRow(2);
    row.height = 20;
  }
};

const mergeRowByIdx = (worksheet, rowid, colNum, text) => {
  worksheet.mergeCells(rowid, 1, rowid, colNum);
  let row = worksheet.getRow(rowid);
  let cell = row.getCell(1);
  // 居中
  cell.alignment = { vertical: 'middle', horizontal: 'center' };
  // 填充文字
  cell.value = text;
};

const mergeRowWithWorksheet = (setting, worksheet, extra) => {
  let offset = extra.rows ? 2 : 0;

  setting.forEach(config => {
    if (config.children) {
      mergeRowWithWorksheet(config.children, worksheet, extra);
    }
    // 合并列
    worksheet.mergeCells(
      config.rowId + offset,
      config.min,
      (config.rowEndId || config.rowId) + offset,
      config.max
    );
    let row = worksheet.getRow(config.rowId + offset);
    let cell = row.getCell(config.min);

    // 居中
    cell.alignment = { vertical: 'middle', horizontal: 'center' };

    // 填充文字
    cell.value = config.title;
  });
};

const createWorkBook = (config: Config) => {
  let { worksheet, workbook } = initWorkSheet(config);
  let { params } = config;
  let columns = getColumn(config);
  if (params.autoid) {
    columns = [
      {
        header: '序号',
        width: 5,
      },
      ...columns,
    ];

    config.body = config.body.map((item, idx) => [idx + 1, ...item]);
  }
  // 先添加表头
  worksheet.columns = columns;

  const needHandleMerge = params.merge.length;
  let headLevel = needHandleMerge ? getHeadLevel(config.columns) : 1;
  if (needHandleMerge) {
    // 复制一列数据到第2列作为表头内容
    let newRow = R.map(R.prop('header'))(columns);
    let headRow = new Array(headLevel - 1).fill(0).map(() => newRow);

    // 如果额外增加两行，需要插入两行空数据，否则前两条数据会失效
    // 2019-09-10
    let extra = config.extra && config.extra.rows > 0 ? [...headRow, [], []] : headRow;

    config.body = [...extra, ...config.body];
  }

  // 添加数据
  worksheet.addRows(config.body);

  // 合并列
  if (needHandleMerge) {
    mergeRowInfo(worksheet, config);
  }

  const mergeCol = (start, end, key) => {
    // 超过1行时，纵向合并数据。否则不合并
    if (end - start <= 1) {
      return;
    }

    let offset = needHandleMerge ? 3 : 2;
    // 第key+1 列，合并第 start+1,end+1
    worksheet.mergeCells(start + offset, key + 1, end + offset - 1, key + 1);
    const row = worksheet.getRow(start + offset);
    let cell = row.getCell(key + 1);
    // 垂直、水平居中、自动换行
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  };

  // 纵向合并数据：20190329
  if (params.mergev.length) {
    let { mergev } = params;
    // 对指定的列做合并处理
    mergev.forEach(key => {
      // 获取数据项
      let rows = lib.getDataByIdx({ key, data: config.body });
      let start = 0;
      for (let end = 1; end < rows.length; end++) {
        if ((rows[end] || '').trim() != (rows[start] || '').trim()) {
          mergeCol(start, end, key);
          // 向右移动新的起始指针
          start = end;
        }
      }
      // bug待修复
      // console.log(key, rows, start);
      mergeCol(start, rows.length, key);
    });
  }

  // top,left,bottom,right
  // worksheet.mergeCells(1, 3, 1, 4);

  // config.body = R.map(item =>
  //   item.map(td => {
  //     if (utils.isNumOrFloat(td)) {
  //       td = Number(td);
  //     } else if (utils.isTime(td)) {
  //       td = td.split('.')[0];
  //     }
  //     return td;
  //   })
  // )(config.body);

  // console.log(config.body);
  //边框及单元格格式
  setCellBorder(worksheet, config);
  return workbook;
};

const setCellBorder = (worksheet, { params, columns }) => {
  let offset = getHeadLevel(columns);

  let startRow = 1;
  // 是否显示额外行

  if (params.extra) {
    offset += 2;
    startRow += 2;
  }

  for (let i = startRow; i <= worksheet.rowCount; i++) {
    const row = worksheet.getRow(i);
    row.height = 20;
    for (let j: number = 1; j <= worksheet.columnCount; j++) {
      let cell = row.getCell(j);
      // 自动换行
      cell.alignment = Object.assign(cell.alignment || {}, { wrapText: true });
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      // if (i == 1) {
      //   cell.font = {
      //     bold: true,
      //   };
      // }
      // 间隔背景
      if ((i - 1) % (params.interval + offset) == 0) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF0F0F0' },
        };
      }

      if (utils.isInt(cell.value)) {
        cell.numFmt = '#,##0';
        cell.value = Number(cell);
      } else if (utils.isFloat(cell.value)) {
        let decimal = params.decimal || '2';
        let append = '0'.padStart(Number(decimal), '0');
        // 单元格计数默认小数位
        cell.numFmt = `#,##0.${append}`;
        cell.value = Number(cell);
      } else if (utils.isTime(cell.value)) {
        cell.value = cell.value.split('.')[0];
        cell.numFmt = 'yyyy/m/d h:mm:ss';
      }
      // console.log(cell.value);
    }
  }
};

const handleFilename: (name: string, param: DstConfig) => string = (filename, param) => {
  filename = filename || document.title;
  if (param.prefix) {
    filename = param.prefix + filename;
  }

  if (param.suffix) {
    let arr: string[] = filename.split('.xlsx');
    filename = arr[0] + param.suffix;
  }

  if (!filename.includes('.xlsx')) {
    filename += '.xlsx';
  }
  return filename.replace(/[^a-zA-Z0-9_\u00A1-\uFFFF\.,\-_ !\(\)]/g, '');
};

export interface CommonConfig {
  body: any[];
  creator: string;
  filename: string;
  header: string[];
  [key: string]: any;
}
export interface SaveSetting extends CommonConfig {
  params: BasicConfig;
}

export interface ConvertSetting extends CommonConfig {
  params: DstConfig;
}
export const save: (config: SaveSetting) => void = ({ params, ...config }) => {
  // 将配置项置于组件入口，不依赖于url地址栏，方便复用
  let newConfig: ConvertSetting = R.clone(config);
  newConfig.params = getParams(params);

  newConfig.filename = handleFilename(newConfig.filename, newConfig.params);

  newConfig = Object.assign({}, newConfig, {
    created: new Date(),
    modified: new Date(),
    lastPrinted: new Date(),
    lastModifiedBy: config.creater,
  });

  let workbook = createWorkBook(newConfig);

  return workbook.xlsx
    .writeBuffer()
    .then(buffer => {
      saveAs(
        new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }),
        config.filename,
        { autoBOM: true }
      );
    })
    .catch(function(error) {
      throw error;
    });
};

// http://localhost:8000/table#id=http://localhost:8000/form/4e00407442.json&merge=0-1&mergetext=%E6%8A%95%E5%85%A5&merge=1-9&mergetext=%E5%8D%B0%E5%88%B7%E5%B7%A5%E5%BA%8F&merge=2-7&mergetext=%E5%85%B6%E5%AE%83%E5%B7%A5%E5%BA%8F&merge=1-2&mergetext=%E5%BA%93%E5%AD%98%E6%95%B0&merge=2-4&mergetext=%E4%BB%98%E5%87%BA%E6%95%B0&merge=1-2&mergetext=%E5%BA%93%E5%AD%98%E5%8F%8A%E4%BB%98%E5%87%BA&product=9607T%E5%93%81&cache=0&daterange=9&menufold=1
