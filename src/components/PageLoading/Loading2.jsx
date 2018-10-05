import React from "react";
import styles from "./Loading2.less";
import classNames from "classnames";
const cls = idx => classNames(styles.hexagon, styles[`hex_${idx}`]);

// loading components from code split
// https://umijs.org/plugin/umi-plugin-react.html#dynamicimport
export default () => (
  <div className={styles.loader}>
    <ul className={styles["hexagon-container"]}>
      {new Array(7).fill(0).map((_, idx) => (
        <li className={cls(idx)} key={idx} />
      ))}
    </ul>
  </div>
);
