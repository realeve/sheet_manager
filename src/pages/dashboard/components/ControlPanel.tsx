import React, { useState } from 'react';
import { Card, Modal } from 'antd';
import styles from './control.less';

const Page = ({ data, type }) => {
  const [show, setShow] = useState(false);
  const [idx, setIdx] = useState(-1);
  return (
    <>
      <h3>{type}</h3>
      <ul className={styles.list}>
        {data.map((item, id) => (
          <li
            key={item.RowOID}
            onClick={() => {
              setShow(true);
              setIdx(id);
            }}
          >
            {item.Name}
          </li>
        ))}
      </ul>
      <Modal
        title={idx == -1 ? '' : data[idx].Name}
        visible={show}
        onOk={() => setShow(false)}
        onCancel={() => setShow(false)}
        width={878}
      >
        <ul className={styles.list}>
          {idx > -1 &&
            data[idx].children.map((item, id) => (
              <li
                key={item.RowOID}
                style={{ height: 80, color: '#555' }}
                onClick={() => {
                  window.open(
                    `http://10.8.1.25:100/novnc/?host=${item.VNCProxyIPAddr}&port=${item.VNCProxyIPPort}&token=${item.VNCToken}`,
                    '_blank'
                  );
                }}
              >
                <span role="img" aria-label="desktop" className="anticon anticon-desktop">
                  <svg
                    viewBox="64 64 896 896"
                    focusable="false"
                    width="35px"
                    height="35px"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M928 140H96c-17.7 0-32 14.3-32 32v496c0 17.7 14.3 32 32 32h380v112H304c-8.8 0-16 7.2-16 16v48c0 4.4 3.6 8 8 8h432c4.4 0 8-3.6 8-8v-48c0-8.8-7.2-16-16-16H548V700h380c17.7 0 32-14.3 32-32V172c0-17.7-14.3-32-32-32zm-40 488H136V212h752v416z"></path>
                  </svg>
                </span>
                {item.Name}
              </li>
            ))}
        </ul>
      </Modal>
    </>
  );
};

export default ({ data, children ,ip}) => (
  <Card title={`VNC远程控制 (本机IP：${ip})`} className={styles.panel}>
    {children}
    {data.map(item => (
      <Page {...item} key={item.type} />
    ))}
  </Card>
);
