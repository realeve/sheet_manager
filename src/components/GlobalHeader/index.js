import React, { PureComponent } from 'react';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import RightContent from './RightContent';
import Bind from 'lodash-decorators/bind';
import { DateRangePicker } from '@/components/QueryCondition';
import { connect } from 'dva';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

class GlobalHeader extends PureComponent {
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  /* eslint-disable*/
  @Bind()
  @Debounce(600)
  triggerResizeEvent() {
    // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };
  render() {
    const { collapsed, isMobile, logo, hidemenu } = this.props;

    return (
      <div className={styles.header}>
        {isMobile && (
          <Link to="/" className={styles.logo} key="logo">
            <img src={logo} alt="logo" width="32" />
          </Link>
        )}
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {!hidemenu && (
            <div className={styles.trigger} onClick={this.toggle}>
              {collapsed ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
            </div>
          )}
          {!isMobile && this.props.selectList.length + this.props.textAreaList.length === 0 && (
            <DateRangePicker
              refresh={true}
              dispatch={this.props.dispatch}
              dateRange={this.props.dateRange}
            />
          )}
        </div>
        <RightContent {...this.props} />
      </div>
    );
  }
}

export default connect(({ common: { dateRange, selectList, textAreaList } }) => ({
  dateRange,
  selectList,
  textAreaList,
}))(GlobalHeader);
