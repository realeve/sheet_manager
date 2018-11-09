import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './GridContent.less';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

class GridContent extends PureComponent {
  render() {
    const { contentWidth, children } = this.props;
    return (
      <div
        className={cx('main', {
          wide: contentWidth === 'Fixed'
        })}>
        {children}
      </div>
    );
  }
}

export default connect(({ setting }) => ({
  contentWidth: setting.contentWidth
}))(GridContent);
