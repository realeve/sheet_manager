import React, { useState } from 'react';
import { Button, Popover } from 'antd';
import styles from './ProdSelect.less';
import ProdItem from './ProdItem';

export default function ProdSelect() {
  const [visible, setVisible] = useState(false);

  const handleVisibleChange = visible => {
    setVisible(visible);
  };
  return (
    <Popover
      placement="rightBottom"
      overlayClassName={styles.prodcontainer}
      trigger="hover"
      content={<ProdItem onClose={() => setVisible(false)} />}
      visible={visible}
      onVisibleChange={handleVisibleChange}
    >
      <Button>冠号查询</Button>
    </Popover>
  );
}
