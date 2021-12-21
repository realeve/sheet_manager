import React from 'react';
import TabTable from '../TabTable';
import { Tabs } from 'antd'
import OnlineCounter from './OnlineCounter'
const TabPane = Tabs.TabPane

const baseConfig = [
  // {
  //   api: 'getQmRectifyMaster',
  //   title: '在线清数情况',
  // },
  {
    api: 'getViewPrintHechaImageCheck',
    title: '图像核查人工判废',
  },
  {
    api: 'getUdtPsExchange',
    title: '胶凹工序大张兑换记录',
  },
  {
    api: 'getQmRectifyMasterChange',
    title: '印码大张及检封小开兑换记录',
  },
];
let config = [
  ...baseConfig,
  {
    api: 'getMahouCodeinfo',
    title: '丝印识码原始记录',
  },
  {
    api: 'getWipJobsRectifyCode',
    title: '印码识码原始记录',
  },
];

let commonConfig = [
  ...baseConfig,
  {
    api: 'getWipJobsRectifyCode',
    title: '印码识码原始记录',
  },
];

export default function OnlineCount({ cart }) {
  return (
    <TabTable
      cart={cart}
      config={cart.slice(2, 4) == '75' ? config : commonConfig}
      simpleIdx={[0, 1, 2]}
      defaultActiveKey="-1"
    ><TabPane tab="在线清数情况" key="-1">
        <OnlineCounter cart={cart} /> </TabPane></TabTable>
  );
}
