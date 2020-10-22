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
  let [valid, setValid] = useState(ip.includes('10.9.'));

  useEffect(() => {
    if (valid) {
      db.proxy109330().then(setMachines);
    } else {
      db.isOnline()
        .then(res => {
          res &&
            db.proxy109330().then(res => {
              setMachines(res);
              setValid(true);
            });
        })
        .catch(() => {
          setValid(false);
          console.log('无生产网权限');
        });
    }

    db.getVNCList().then(setVnclist);
  }, []);

  return (
    <ControlPanel data={machines} ip={ip}>
      {vnclist.length > 0 && <ControlPanel2 data={!valid ? [...vnclist, ...db.mList] : vnclist} />}
    </ControlPanel>
  );
}

export default connect(({ common: { ip } }: { common: ICommon }) => ({ ip }))(Dashboard);
