import React, { useState, useEffect } from 'react';
import * as db from './utils/db';
import 'animate.css';
import ControlPanel2 from './components/ControlPanel2';
export default function Dashboard() {
  let [vnclist, setVnclist] = useState([]);
  useEffect(() => {
    db.getVNCManage().then(setVnclist);
  }, []);
  return vnclist.length > 0 && <ControlPanel2 data={vnclist} />;
}
