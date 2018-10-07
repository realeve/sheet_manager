import React, { Component, Fragment } from 'react';
import { formatMessage } from 'umi/locale';
import { Switch, List } from 'antd';

class NotificationView extends Component {
  getData = () => {
    const Action = (
      <Switch
        checkedChildren={formatMessage({ id: 'app.settings.active' })}
        unCheckedChildren={formatMessage({ id: 'app.settings.unactive' })}
        defaultChecked
      />
    );
    return [
      {
        title: '张三',
        description: '某部门',
        actions: [Action]
      },
      {
        title: '张四',
        description: '某部门2',
        actions: [Action]
      }
    ];
  };

  render() {
    return (
      <Fragment>
        <List
          itemLayout="horizontal"
          dataSource={this.getData()}
          renderItem={item => (
            <List.Item actions={item.actions}>
              <List.Item.Meta
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </Fragment>
    );
  }
}

export default NotificationView;
