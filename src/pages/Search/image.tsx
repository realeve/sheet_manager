import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Input } from 'antd';
import styles from './Image.less';

function SearchPage({ cart }) {
  const [code, setCode] = useState(null);

  const onChange = e => {
    let cart = e.target.value.trim().toUpperCase();
    setCode(cart);
    console.log(cart);
  };

  return (
    <Card>
      <div className={styles.imgsearch}>
        <div className={styles.title}>
          <div className={styles.container}>
            <div className={styles.item}>所有图像</div>/<div className={styles.item}>票面</div>/
            <div className={styles.item}>丝印</div>/<div className={styles.item}>号码</div>
          </div>
          <Input.Search
            value={code}
            onChange={onChange}
            placeholder="开位/印码号筛选"
            className={styles.search}
            style={{ width: 200 }}
            maxLength={8}
          />
        </div>
      </div>
    </Card>
  );
}

export default connect(({ search: { cart } }) => ({
  cart,
}))(SearchPage);
