import React, { PureComponent } from 'react';
import Link from 'umi/link';
import RightContent from '../GlobalHeader/RightContent';
import BaseMenu from '../SiderMenu/BaseMenu';
import styles from './index.less';
import classNames from 'classnames';

export default class TopNavHeader extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      maxWidth:
        (props.contentWidth === 'Fixed' ? 1200 : window.innerWidth) -
        330 -
        165 -
        4 -
        36
    };
  }

  static getDerivedStateFromProps(props) {
    return {
      maxWidth:
        (props.contentWidth === 'Fixed' ? 1200 : window.innerWidth) -
        330 -
        165 -
        4 -
        36
    };
  }

  render() {
    const { theme, contentWidth, logo } = this.props;
    const { maxWidth } = this.state;
    const clsHead = classNames(styles.head, {
      [styles.light]: theme === 'light'
    });
    const clsMain = classNames(styles.main, {
      [styles.wide]: contentWidth === 'Fixed'
    });
    return (
      <div className={clsHead}>
        <div className={clsMain}>
          <div className={styles.left}>
            <div className={styles.logo} key="logo" id="logo">
              <Link to="/">
                <img src={logo} alt="logo" />
                <h1>Ant Design Pro</h1>
              </Link>
            </div>
            <div
              style={{
                maxWidth
              }}>
              <BaseMenu
                {...this.props}
                style={{ border: 'none', height: 64 }}
              />
            </div>
          </div>
          <RightContent {...this.props} />
        </div>
      </div>
    );
  }
}
