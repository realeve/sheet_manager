import React, { PureComponent } from 'react';
import { List, Menu } from 'antd';

import { connect } from 'dva';

@connect(({ list }) => ({
  list
}))
class Center extends PureComponent {
  render() {
    // const {
    //   list: { list }
    // } = this.props;
    const itemMenu = (
      <Menu>
        <Menu.Item>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="http://www.alipay.com/">
            1st menu item
          </a>
        </Menu.Item>
        <Menu.Item>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="http://www.taobao.com/">
            2nd menu item
          </a>
        </Menu.Item>
        <Menu.Item>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="http://www.tmall.com/">
            3d menu item
          </a>
        </Menu.Item>
      </Menu>
    );

    return (
      <List
        rowKey="id"
        // className={stylesApplications.filterCardList}
        grid={{ gutter: 24, xxl: 3, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
        // dataSource={list}
        renderItem={item => <List.Item key={item.id} />}
      />
    );
  }
}

export default Center;
