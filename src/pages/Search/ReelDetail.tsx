import React from 'react';
import { connect } from 'dva';
import { Row } from 'antd';
import MachineCheck from './components/reel/MachineCheck';
import PscInfo from './components/reel/PscInfo';
import PackageInfo from './components/reel/PackageInfo';
import FakeAnanysis from './components/reel/FakeAnanysis';
export default connect(({ search: { reel } }) => ({
  reel,
}))(({ reel }) => (
  <Row gutter={10}>
    <MachineCheck reel={reel} />
    <FakeAnanysis reel={reel}/>
    <PscInfo reel={reel} />
    <PackageInfo reel={reel}/>
  </Row>
));
