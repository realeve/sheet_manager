import Excel from 'exceljs/dist/es5/exceljs.browser.js';
import { saveAs } from 'file-saver';
import * as R from 'ramda';
import jStat from 'jStat';
import lib from '@/pages/chart/utils/lib';
import { AUTHOR } from './setting';
import { getParams, Config, BasicConfig, DstConfig } from './excelConfig';

const initWorkSheet = (config: Config) => {
  let workbook = new Excel.Workbook(config);

  workbook.title = config.filename.replace('.xlsx', '');
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

  // 冻结行列
  const ySplit = config.params.merge.length ? 2 : 1;
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
      R.max(header.length),
      jStat.max,
      R.map(item => String(item).length)
    )(rows);

    // 一个文字宽度2.1
    return { header, width: wordLength * 2.1 };
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
  if (needHandleMerge) {
    // 复制一列数据到第2列作为表头内容
    let newRow = R.map(R.prop('header'))(columns);

    config.body = [newRow, ...config.body];
  }

  // 添加数据
  worksheet.addRows(config.body);

  // 合并列
  if (needHandleMerge) {
    const row = worksheet.getRow(1);

    params.merge.forEach(([start, end], idx) => {
      worksheet.mergeCells(1, start, 1, end);
      // 合并后居中
      let cell = row.getCell(start);
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      // 填充文字
      cell.value = params.mergetext[idx];
    });
    row.eachCell(function(cell, idx) {
      // 不需合并的单元格
      if (!params.mergedRows.includes(idx)) {
        worksheet.mergeCells(1, idx, 2, idx); //合并两行
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      }
    });
  }

  // top,left,bottom,right
  // worksheet.mergeCells(1, 3, 1, 4);

  //边框及单元格格式
  setCellBorder(worksheet, config.params);
  return workbook;
};

const setCellBorder = (worksheet, params) => {
  for (let i = 1; i <= worksheet.rowCount; i++) {
    const row = worksheet.getRow(i);
    row.height = 20;
    for (let j: number = 1; j <= worksheet.columnCount; j++) {
      let cell = row.getCell(j);
      // cell.alignment = { wrapText: true };
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
      if ((i - 1) % params.interval == 0) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF0F0F0' },
        };
      }
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

  workbook.xlsx
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
