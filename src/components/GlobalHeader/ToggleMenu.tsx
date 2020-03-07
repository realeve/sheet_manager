import React, { PureComponent } from 'react';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import Bind from 'lodash-decorators/bind';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { connect } from 'dva';

class ToggleMenu extends PureComponent {
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
    const { collapsed, dispatch } = this.props;
    // console.log(collapsed, '手工调整');
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: !collapsed,
    });
    this.triggerResizeEvent();
  };
  render() {
    const style = this.props.inside_menu ? { color: '#fff' } : {};
    return (
      !this.props.hidemenu && (
        <div className={styles.trigger} style={this.props.style} onClick={this.toggle}>
          {this.props.collapsed ? (
            <MenuFoldOutlined style={style} />
          ) : (
            <MenuUnfoldOutlined style={style} />
          )}
        </div>
      )
    );
  }
}

export default connect(({ global, common }) => ({
  collapsed: global.collapsed,
  hidemenu: common.hidemenu,
}))(ToggleMenu);
