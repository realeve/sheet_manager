import React, { Component, Fragment } from 'react';
import { formatMessage } from 'umi/locale';
import { Switch, List } from 'antd';
import * as db from '@/pages/login/service';

class NotificationView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    };
  }

  loadUsers = async () => {
    let { data } = await db.getSysUserUnActived();
    this.setState({
      users: data.map(({ _id, fullname: title, dept_name: description }) => ({
        _id,
        title,
        description
      }))
    });
  };

  componentDidMount() {
    this.loadUsers();
  }

  onChange = (checked, _id) => {
    console.log(`${_id} switch to ${checked}`);
  };

  getData = () => {
    const Action = ({ uid }) => (
      <Switch
        checkedChildren={formatMessage({ id: 'app.settings.active' })}
        unCheckedChildren={formatMessage({ id: 'app.settings.unactive' })}
        onChange={e => this.onChange(e, uid)}
      />
    );
    let { users } = this.state;
    return users.map(item =>
      Object.assign(item, { actions: [<Action uid={item._id} />] })
    );
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
