import React from 'react';
import { connect } from 'dva';
import { Row } from 'antd';
import MachineCheck from './components/reel/MachineCheck';
import PscInfo from './components/reel/PscInfo';

function ReelDetail({ dispatch, ...params }) {
  const { reel } = params;
  return (
    <Row gutter={10}>
      <MachineCheck reel={reel} />
      <PscInfo reel={reel} />
    </Row>
  );
}

export default connect(({ search }) => ({
  ...search,
}))(ReelDetail);
