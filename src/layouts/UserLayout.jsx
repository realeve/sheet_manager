import React, { PureComponent } from 'react';
import styles from './UserLayout.less';
import GlobalFooter from '@/layouts/Footer.jsx';
import * as setting from '@/utils/setting';

export default class UserLayout extends PureComponent {
  render() {
    const { children } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <div>
                <img alt="logo" className={styles.logo} src="/img/logo.svg" />
                <span className={styles.title}>{setting.systemName}</span>
              </div>
            </div>
            <div className={styles.desc}>让数据栩栩如生</div>
          </div>
          <div className={styles.main}>{children}</div>
          <GlobalFooter className={styles.footer} />
        </div>
      </div>
    );
  }
}
