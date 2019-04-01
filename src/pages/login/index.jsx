import React, { Component } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { FormattedMessage } from 'umi/locale';
// import 'ant-design-pro/dist/ant-design-pro.css'; // 统一引入样式

import { Alert, Checkbox } from 'antd';
import Login from 'ant-design-pro/lib/Login';
import styles from './index.less';
import * as db from './service';
import userTool from '@/utils/users';
import Link from 'umi/link';
import PinyinSelect from '@/components/PinyinSelect';
import { ORG } from '@/utils/setting';

const { UserName, Password, Submit } = Login;

class LoginComponent extends Component {
  state = {
    notice: '',
    autoLogin: true,
    avatar: '',
    submitting: false,
    ip: '',
    depts: [],
    dept: null,
  };

  onSubmit = (_, values) => {
    this.login(values);
  };

  changeAutoLogin = e => {
    let { checked } = e.target;
    this.setState({
      autoLogin: checked,
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

  async login(param) {
    this.setState({
      submitting: true,
    });

    // todo 20190401 此处提供uid读取接口
    let values = { ...param, dept: this.state.dept, org: ORG, uid: '54000000' };

    let userInfo = await db
      .getSysUser(values)
      .finally(e => {
        this.setState({
          submitting: false,
        });
      })
      .catch(e => {
        this.setState({
          notice: '系统错误，登录失败',
        });
        return;
      });
    const autoLogin = this.state.autoLogin;

    if (userInfo.rows > 0) {
      let userSetting = userInfo.data[0];
      if (userSetting.actived === 0) {
        this.setState({
          notice: '帐户未激活，请联系管理员',
        });
        return;
      } else {
        this.setState({
          notice: '',
        });
      }

      userSetting.menu = JSON.parse(userSetting.menu);

      this.handleAutoLogin({ values, setting: userSetting, autoLogin });
      this.props.dispatch({
        type: 'common/setStore',
        payload: {
          userSetting,
          isLogin: true,
        },
      });

      window.localStorage.setItem('_userMenuTitle', userSetting.menu_title);
      userTool.saveLoginStatus(1);

      const query = this.props.location.query;
      let nextUrl = query.redirect || userTool.readLastRouter();

      router.push(nextUrl);
      return;
    }

    this.setState({
      notice: '账号或密码错误！',
    });
  }

  loadDepts = async () => {
    db.getSysDept().then(({ data: depts, ip }) => {
      depts = depts.map(({ value, value: name }) => ({ name, value }));
      this.setState({
        ip,
        depts,
      });
      if (ip.slice(0, 4) !== '10.9') {
        return;
      }
      this.setState({
        notice: '生产网测试用户：用户名：jitai，密码：12345',
      });
    });
  };

  componentDidMount() {
    this.loadDepts();

    let { data, success } = userTool.getUserSetting();
    let avatar = '/img/avatar.svg';

    if (!success || !data.autoLogin) {
      this.setState({
        avatar,
      });
      return;
    }

    this.setState({
      avatar: data.setting.avatar,
      dept: data.values.dept,
    });

    const query = this.props.location.query;
    if (query.autoLogin === '0' || query.redirect) {
      return;
    }
    this.login(data.values);
  }

  forgetPsw = () => {
    const {
      location: { query },
    } = this.props;

    let pathname = `/login/forget`;
    router.push({
      pathname,
      query,
      state: {
        account: 'guest',
        forget: true,
      },
    });
  };

  render() {
    const { autoLogin, avatar, submitting, depts, dept } = this.state;
    const {
      location: { search },
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
          <div style={{ marginTop: 20, marginBottom: 20 }}>
            <PinyinSelect
              style={{ width: 220 }}
              size="large"
              className={styles.selector}
              value={dept}
              onSelect={dept => this.setState({ dept })}
              options={depts}
              placeholder="选择所在部门"
            />
          </div>
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
          <Link style={{ float: 'right', marginBottom: 12 }} to={`/login/register${search}`}>
            <FormattedMessage id="app.login.signup" />
          </Link>
        </div>
      </Login>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.common,
  };
}

export default connect(mapStateToProps)(LoginComponent);
