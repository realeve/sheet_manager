import React from 'react';
import TabTable from '../TabTable';
let config = [{
  api: 'getViewScoreOffset',
  title: "胶印离线检测"
}, {
  api: 'getViewScoreIntaglio',
  title: "凹印离线检测"
}]

export default function LogInfo({ cart }) {
  return <TabTable cart={cart} config={config} simpleIdx={[0, 1]} />
}
