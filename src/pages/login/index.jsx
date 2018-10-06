import React, { Component } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { FormattedMessage } from 'umi/locale';

import { Alert, Checkbox } from 'antd';
import Login from 'ant-design-pro/lib/Login';
import styles from './index.less';
import * as db from './service';
import userTool from '@/utils/users';
import Link from 'umi/link';

const { UserName, Password, Submit } = Login;

class LoginComponent extends Component {
  state = {
    notice: '',
    autoLogin: true,
    avatar: '',
    submitting: false,
    ip: ''
  };

  onSubmit = (_, values) => {
    this.login(values);
  };

  changeAutoLogin = e => {
    let { checked } = e.target;
    this.setState({
      autoLogin: checked
    });
    if (!checked) {
      userTool.clearUserSetting();
    }
  };

  handleAutoLogin = values => {
    if (this.state.autoLogin) {
      userTool.saveUserSetting(values);
    } else {
      userTool.clearUserSetting();
    }
  };

  async login(values) {
    this.setState({
      submitting: true
    });
    let userInfo = await db
      .getSysUser(values)
      .finally(e => {
        this.setState({
          submitting: false
        });
      })
      .catch(e => {
        this.setState({
          notice: '系统错误，登录失败'
        });
        return;
      });
    const autoLogin = this.state.autoLogin;

    if (userInfo.rows > 0) {
      let userSetting = userInfo.data[0];
      if (userSetting.actived === 0) {
        this.setState({
          notice: '帐户未激活，请联系管理员'
        });
        return;
      } else {
        this.setState({
          notice: ''
        });
      }

      userSetting.menu = JSON.parse(userSetting.menu);

      this.handleAutoLogin({ values, setting: userSetting, autoLogin });
      this.props.dispatch({
        type: 'common/setStore',
        payload: {
          userSetting
        }
      });

      const query = this.props.location.query;
      let nextUrl = query.redirect || userTool.readLastRouter();

      router.push(nextUrl);
      return;
    }

    this.setState({
      notice: '账号或密码错误！'
    });
  }

  componentDidMount() {
    let { data, success } = userTool.getUserSetting();
    let avatar = '/img/avatar.svg';
    if (!success || !data.autoLogin) {
      this.setState({
        avatar
      });
      return;
    }

    this.setState({
      avatar: data.setting.avatar
    });

    const query = this.props.location.query;
    if (query.autoLogin === '0' || query.redirect) {
      return;
    }
    this.login(data.values);
  }

  handleLoginIp = async () => {
    let { ip } = await db.getIp();
    this.setState({ ip });
    db.getSysUserIp();
  };

  forgetPsw = () => {
    const {
      location: { query }
    } = this.props;

    let pathname = `/login/forget`;
    router.push({
      pathname,
      query,
      state: {
        account: 'guest',
        forget: true
      }
    });
  };

  render() {
    const { autoLogin, avatar, submitting } = this.state;
    const {
      location: { search }
    } = this.props;
    return (
      <Login defaultActiveKey={this.state.type} onSubmit={this.onSubmit}>
        <div>
          <img alt="avatar" className={styles.avatar} src={avatar} />
          <h2 className={styles.title}>
            <FormattedMessage id="app.login.login" />
          </h2>
          {this.state.notice && (
            <Alert
              style={{ marginBottom: 24 }}
              message={this.state.notice}
              type="error"
              showIcon
              closable
            />
          )}
          <UserName name="username" placeholder="用户名" autoComplete="false" />
          <Password name="password" placeholder="密码" autoComplete="false" />
        </div>
        <div>
          <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
            <FormattedMessage id="app.login.remember-me" />
          </Checkbox>
          <a style={{ float: 'right' }} onClick={this.forgetPsw}>
            <FormattedMessage id="app.login.forgot-password" />
          </a>
        </div>
        <div className={styles.action}>
          <Submit loading={submitting}>
            <FormattedMessage id="app.login.login" />
          </Submit>
          <Link
            style={{ float: 'right', marginBottom: 12 }}
            to={`/login/register${search}`}>
            <FormattedMessage id="app.login.signup" />
          </Link>
        </div>
      </Login>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.common
  };
}

export default connect(mapStateToProps)(LoginComponent);
