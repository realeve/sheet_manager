import React, { useState } from 'react';
import { Modal } from 'antd';
import styles from './index.less';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export default () => {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <div
        onClick={() => {
          setVisible(true);
        }}
        style={{ cursor: 'pointer' }}
      >
        📢 车号编码规则
      </div>
      <Modal
        title="编码规则"
        visible={visible}
        onCancel={() => {
          setVisible(false);
        }}
        onOk={() => {
          setVisible(false);
        }}
      >
        <div className={styles.cartRules}>
          <div className={styles.title}>1.新编码</div>
          <div className={styles.desc}>
            <div className={styles.item2}>年份</div>
            <div className={styles.item1}>品种</div>
            <div className={styles.item1}>T品标志</div>
            <div className={styles.item4}>车号编码</div>
          </div>
          <div className={styles.cart}>
            <div className={cx(styles.line, styles.item2)}>20</div>
            <div className={cx(styles.item1, styles.line)}>
              <span>2</span>
              <span>|</span>
              <span>
                7<small>:2-7，96品 品种编码;1代表尼泊尔钞</small>
              </span>
            </div>
            <div className={cx(styles.line, styles.item1)}>
              <span>0</span>
              <span>
                5<small>(5:T品，0:A品)</small>
              </span>
            </div>
            <div className={cx(styles.line, styles.item4)}>A023</div>
          </div>

          <div
            className={styles.title}
            style={{ marginTop: 20, borderTop: '1px solid rgba(0,0,0,0.25)' }}
          >
            2.旧编码
          </div>
          <div className={styles.desc}>
            <div className={styles.item2}>年份</div>
            <div className={styles.item1}>品种</div>
            <div className={styles.item1}>备用标记</div>
            <div className={styles.item4}>车号编码</div>
          </div>
          <div className={styles.cart}>
            <div className={cx(styles.line, styles.item2)}>19</div>
            <div className={cx(styles.item1, styles.line)}>
              <span>2</span>
              <span>
                0<small>:6T</small>
              </span>
              <span>
                3至7<small>:A品</small>
              </span>
              <span>
                8<small>:7T</small>
              </span>
            </div>
            <div className={cx(styles.line, styles.item1)}>
              <span>0</span>
            </div>
            <div className={cx(styles.line, styles.item4)}>A023</div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
