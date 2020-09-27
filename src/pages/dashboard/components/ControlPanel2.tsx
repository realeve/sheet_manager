import React from 'react';
import { Card } from 'antd';
import styles from './control.less';

const Page = ({ data, type }) => {
  return (
    <>
      <h3>{type}</h3>
      <ul className={styles.list}>
        {data.map((item, id) => (
          <li
            key={item.token}
            onClick={() => {
              window.open(
                `//10.8.1.25:100/novnc/?host=10.8.1.25&port=8080&token=${item.token}`,
                '_blank'
              );
            }}
          >
            {item.machine}
          </li>
        ))}
      </ul>
    </>
  );
};

export default ({ data }) => data.map(item => <Page {...item} key={item.type} />);
