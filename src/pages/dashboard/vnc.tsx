import React, { useState, useEffect } from 'react';
import * as db from './utils/db';
import 'animate.css';
import ControlPanel from './components/ControlPanel';
import ControlPanel2 from './components/ControlPanel2';
import { connect } from 'dva';

import { ICommon } from '@/models/common';

function Dashboard({ ip }) {
  let [machines, setMachines] = useState([]);
  let [vnclist, setVnclist] = useState([]);

  // 生产网IP
  const shouldConnect = ip.includes('10.9.');
  useEffect(() => {
    if (shouldConnect) {
      db.proxy109330().then(setMachines);
    } else {
      db.isOnline().then(res => {
        res && db.proxy109330().then(setMachines);
      });
    }

    db.getVNCList().then(setVnclist);
  }, []);

  return (
    machines.length > 0 && (
      <ControlPanel data={machines} ip={ip}>
        {vnclist.length > 0 && <ControlPanel2 data={vnclist} />}
      </ControlPanel>
    )
  );
}

export default connect(({ common: { ip } }: { common: ICommon }) => ({ ip }))(Dashboard);
