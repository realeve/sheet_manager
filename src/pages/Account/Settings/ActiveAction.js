import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import { Switch, Select, message } from 'antd';
import * as db from '@/pages/login/service';
const { Option } = Select;

class ActiveAction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      userTypes: props.userTypes,
      user_type: 0,
      loading: false,
      checked: false,
      menu_id: 1,
    };
  }

  onChange = async (checked, _id) => {
    this.setState({ loading: true, checked });
    if (!checked) {
      return;
    }
    let {
      data: [{ affected_rows }],
    } = await db
      .setSysUserActive({
        user_type: this.state.user_type,
        menu_id: this.state.menu_id,
        _id,
      })
      .finally(_ => {
        this.setState({
          loading: false,
          user_type: 0,
          checked: false,
        });
      });

    if (affected_rows) {
      message.success('激活成功!');
      this.props.onChange(_id);
    } else {
      message.error('激活失败!');
    }
  };

  changeUserType = user_type => {
    this.setState({ user_type });
    // console.log(user_type);
  };

  changeMenu = menu_id => {
    this.setState({ menu_id });
  };

  render() {
    let { uid, userTypes, menuList } = this.props;

    return (
      <>
        <Select
          size="small"
          style={{ width: 200, marginRight: 10 }}
          onChange={this.changeMenu}
          placeholder={formatMessage({
            id: 'validation.menu',
          })}
        >
          {menuList.map(({ id, value }) => (
            <Option value={id} key={id}>
              {value}
            </Option>
          ))}
        </Select>
        <Select
          size="small"
          style={{ width: 100, marginRight: 10 }}
          onChange={this.changeUserType}
          placeholder={formatMessage({
            id: 'validation.permission',
          })}
        >
          {userTypes.map(({ id, value }) => (
            <Option value={id} key={id}>
              {value}
            </Option>
          ))}
        </Select>
        <Switch
          checked={this.state.checked}
          disabled={this.state.user_type === 0}
          checkedChildren={formatMessage({ id: 'app.active' })}
          unCheckedChildren={formatMessage({ id: 'app.unactive' })}
          onChange={e => this.onChange(e, uid)}
        />
      </>
    );
  }
}

export default ActiveAction;
