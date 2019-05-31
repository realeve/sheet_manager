import React from 'react';
import TabTable from '../TabTable';
let config = [
  {
    api: 'getViewPrintHechaImageCheck',
    title: '图像核查人工判废'
  }, {
    api: 'getQmRectifyMaster',
    title: "在线清数情况"
  }, {
    api: 'getUdtPsExchange',
    title: "胶凹工序大张兑换记录"
  }, {
    api: 'getQmRectifyMasterChange',
    title: "印码大张及检封小开兑换记录"
  }, {
    api: 'getWipJobsRectifyCode',
    title: "印码识码原始记录"
  }]

export default function OnlineCount({ cart }) {
  return <TabTable cart={cart} config={config} simpleIdx={[0, 1, 2]} />
}