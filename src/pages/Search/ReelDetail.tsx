import React from 'react';
import { connect } from 'dva';
import { Row } from 'antd';
import MachineCheck from './components/reel/MachineCheck';
import PscInfo from './components/reel/PscInfo';

export default connect(({ search: { reel } }) => ({
  reel,
}))(({ reel }) => (
  <Row gutter={10}>
    <MachineCheck reel={reel} />
    <PscInfo reel={reel} />
  </Row>
));
