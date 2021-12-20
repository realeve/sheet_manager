import React from 'react';
import TabTable from '../TabTable';

let config = [
  {
    api: 'getNoteaysdata',
    title: '印钞特抽信息',
    // isAntd: false,
  },
  {
    api: 'getQfmWipJobsMahouSrc',
    title: '票面原始记录',
  },
  {
    api: 'getQfmWipJobsCodeFake',
    title: '印码大张废',
  },
  {
    api: 'getWipJobsCodeSrc',
    title: '号码三合一',
  },
  {
    api: 'getOcrContrastResult',
    title: 'OCR识码原始记录',
  },
  {
    api: 'getViewPrintOcr',
    title: 'OCR汇总',
  },
  {
    api: 'getQfmWipJobsLeak',
    title: '人工漏判',
  },
  {
    api: 'getQfmWipJobsSilk',
    title: '丝印判废',
  },
  {
    api: 'getQfmWipJobsUncheck',
    title: '大张未检查询',
  },
  {
    api: 'getVCbpcCfturnguard',
    title: '清分机兑换记录',
  },
];

export default function LogInfo({ cart }) {
  return <TabTable cart={cart} config={config} />;
}
