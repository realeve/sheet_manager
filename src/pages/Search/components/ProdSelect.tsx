import React, { useState, useEffect } from 'react';
import { Button, Popover } from 'antd';
import styles from './ProdSelect.less';
import ProdItem from './ProdItem';

export default function ProdSelect({ type }) {
  const [visible, setVisible] = useState(type);

  useEffect(() => {
    setVisible(type);
  }, [type]);

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
