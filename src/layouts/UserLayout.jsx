import React, { PureComponent } from 'react';
import styles from './UserLayout.less';
import GlobalFooter from '@/layouts/Footer';
import * as setting from '@/utils/setting';
import classnames from 'classnames';
import logo from '../assets/logo.svg';

export default class UserLayout extends PureComponent {
  render() {
    const { children, avatar } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <div>
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>{setting.systemName}</span>
              </div>
            </div>
            <div className={styles.desc}>让数据栩栩如生</div>
          </div>
          <div className={classnames(styles.main, 'loginMain')}>
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                background: `url(${avatar}) cover no-repeat`,
                // backgroundSize: 'cover',
                filter: 'blur(35px)',
              }}
            ></div>
            {children}
          </div>
          <GlobalFooter className={styles.footer} color="rgba(255, 255, 255, 0.6)" />
        </div>
      </div>
    );
  }
}
