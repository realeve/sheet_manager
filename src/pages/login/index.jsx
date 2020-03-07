import React, { Component } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { FormattedMessage } from 'umi/locale';

import { Icon } from '@ant-design/compatible';
import { Alert, Checkbox, Input } from 'antd';
import Login from './components/Login';
import styles from './index.less';
import * as db from './service';
import userTool from '@/utils/users';
import Link from 'umi/link';
import PinyinSelect from '@/components/PinyinSelect';
import { ORG, uap } from '@/utils/setting';
// import * as rtx from '@/utils/rtx';
import * as R from 'ramda';

const { Submit } = Login;

class LoginComponent extends Component {
  state = {
    notice: '',
    autoLogin: true,
    avatar: '',
    submitting: false,
    ip: '',
    depts: [],
    dept: null,
    userList: [],
    uid: null,
    username: '',
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

  login = async () => {
    this.setState({
      submitting: true,
    });

    let { dept, uid, username, autoLogin, password } = this.state;

    // todo 20190401 此处提供uid读取接口
    let values = { password, uid, username, dept, org: ORG };

    // 是否启用统一认证登录
    // if (uap.active) {
    //   let { uid } = rtx.getUserDetail(userList, param.username);
    //   values.uid = uid;
    // }

    let userInfo = await db
      .getSysUser(values)
      .finally(e => {
        this.setState({
          submitting: false,
        });
      })
      .catch(e => {
        this.setState({
          notice: '系统错误，登录失败，请稍后重试',
        });
        return {
          rows: -1,
        };
      });

    console.log(userInfo);

    if (userInfo.rows > 0) {
      let userSetting = userInfo.data[0] || userInfo.data;
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
      // console.log(userSetting);

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
      window.location.href = nextUrl;
      // router.push(nextUrl);
      return;
    } else if (userInfo.rows == 0) {
      this.setState({
        notice: '账号或密码错误！',
      });
    }
  };

  loadDepts = async () => {
    db.getSysDept().then(({ data: depts, ip }) => {
      depts = depts.map(({ value, value: name }) => ({ name, value }));
      this.setState(
        {
          ip,
          depts,
        },
        () => {
          this.loadUser();
        }
      );

      if (['10.9', '10.8', '0.0.'].includes(ip.slice(0, 4))) {
        this.setState({
          notice: (
            <div>
              测试用户
              <p>
                用户名：jitai
                <br />
                密码：12345
              </p>
            </div>
          ),
        });
      }
    });
  };
  loadUser = async () => {
    if (uap.active && this.state.dept && this.state.dept.length > 0) {
      let { data: userList } = await db.getUserListBydept(this.state.dept); //await rtx.init();
      this.setState({ userList });
    }
  };

  componentDidMount() {
    this.loadDepts();
    // console.log('componentDidMount 7');

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
      uid: data.values.username,
      username: data.values.username,
      password: data.values.password,
    });

    const query = this.props.location.query;
    if (query.autoLogin === '0' || query.redirect) {
      return;
    }
    this.login();
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

  onUserChange = uid => {
    let user = R.find(R.propEq('value', uid))(this.state.userList);
    // console.log(uid, user, this.state.userList);
    if (R.isNil(user)) {
      user = { name: uid, value: uid };
    }
    this.setState({ username: user.name, uid: user.value });
  };

  onDeptChange = dept => {
    this.setState({ dept }, () => {
      this.loadUser();
    });
  };

  render() {
    const { autoLogin, avatar, submitting, depts, dept, userList, uid, password } = this.state;
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
            <Icon type="home" theme="twoTone" />
            <PinyinSelect
              style={{ width: 190, marginLeft: 10 }}
              size="large"
              className={styles.selector}
              value={dept}
              onSelect={this.onDeptChange}
              options={depts || []}
              placeholder="选择所在部门"
              mode="default"
            />
          </div>
          <div style={{ marginTop: 20, marginBottom: 20 }}>
            <Icon type="user" />
            <PinyinSelect
              style={{ width: 190, marginLeft: 10 }}
              size="large"
              className={styles.selector}
              value={uid}
              onSelect={this.onUserChange}
              options={userList || []}
              placeholder="姓名或用户名"
              mode="tags"
              maxTagCount={1}
              maxTagPlaceholder="请输入姓名或用户名"
              onDeselect={() => {
                this.setState({ uid: null });
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Icon type="eye-invisible" theme="twoTone" style={{ height: 32, lineHeight: '32px' }} />
            <Input
              style={{ width: 190, marginLeft: 10 }}
              type="password"
              value={password}
              placeholder="密码"
              autoComplete="false"
              onPressEnter={this.login}
              size="large"
              onChange={e => this.setState({ password: e.target.value })}
            />
          </div>
          {/* <UserName name="username" placeholder="用户名" autoComplete="false" /> */}
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
