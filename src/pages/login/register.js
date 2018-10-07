import React, { Component } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import {
  Form,
  Input,
  Button,
  Popover,
  Progress,
  Select,
  notification
} from 'antd';
import styles from './Register.less';
import * as db from './service';

import 'ant-design-pro/dist/ant-design-pro.css'; // 统一引入样式

const FormItem = Form.Item;
const { Option } = Select;

export const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      <FormattedMessage id="validation.password.strength.strong" />
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      <FormattedMessage id="validation.password.strength.medium" />
    </div>
  ),
  poor: (
    <div className={styles.error}>
      <FormattedMessage id="validation.password.strength.short" />
    </div>
  )
};

export const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception'
};

@Form.create()
class Register extends Component {
  state = {
    count: 0,
    confirmDirty: false,
    visible: false,
    help: '',
    depts: [],
    submitting: false,
    ip: ''
  };

  loadDepts = async () => {
    db.getSysDept().then(({ data: depts }) => {
      this.setState({
        depts
      });
    });

    db.getIp().then(({ ip }) => {
      this.setState({ ip });
    });
  };
  componentDidMount() {
    this.loadDepts();
  }

  getFormParam = () => {
    const { form } = this.props;
    const { username, psw, dept_id, fullname } = form.getFieldsValue();
    let params = {
      username,
      fullname,
      psw,
      avatar: '/img/avatar.svg',
      user_type: 2,
      dept_id,
      menu_id: 1,
      actived: 0,
      ip: this.state.ip
    };
    return params;
  };

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('psw');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length >= 5) {
      return 'pass';
    }
    return 'poor';
  };

  handleSubmit = e => {
    e.preventDefault();
    this.setState({
      submitting: true
    });
    const { form } = this.props;
    form.validateFields({ force: true }, async err => {
      if (err) {
        this.setState({
          submitting: false
        });
        return;
      }
      let params = this.getFormParam();
      let {
        data: [{ affected_rows }]
      } = await db.addSysUser(params).finally(e => {
        this.setState({
          submitting: false
        });
      });
      if (affected_rows === 0) {
        notification.error({
          message: '注册失败',
          description: '帐户注册失败，请稍后重试.'
        });
        return;
      }
      form.resetFields();
      this.showResult(params.username);
    });
  };

  showResult = account => {
    const {
      location: { query }
    } = this.props;

    let pathname = `/login/forget`;
    router.push({
      pathname,
      query,
      state: {
        account: 'guest'
      }
    });
  };

  // handleConfirmBlur = e => {
  //   const { value } = e.target;
  //   const { confirmDirty } = this.state;
  //   this.setState({ confirmDirty: confirmDirty || !!value });
  // };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('psw')) {
      callback(formatMessage({ id: 'validation.password.twice' }));
    } else {
      callback();
      this.setState({
        visible: false
      });
    }
  };

  // 检查用户名格式以及是否存在
  checkUsername = async (_, username, callback) => {
    let pattern = /^[a-zA-Z0-9_-]{5,16}$/;
    if (!pattern.test(username)) {
      callback(formatMessage({ id: 'validation.username.wrong-format' }));
      return;
    }
    const {
      data: [{ value }]
    } = await db.getSysUserExist(username);
    if (value > 0) {
      callback(formatMessage({ id: 'validation.username.existed' }));
      return;
    }
    callback();
  };

  checkPassword = (rule, value, callback) => {
    const { visible, confirmDirty } = this.state;
    if (!value) {
      this.setState({
        help: formatMessage({ id: 'validation.password.required' }),
        visible: !!value
      });
      callback('error');
    } else {
      this.setState({
        help: ''
      });
      if (!visible) {
        this.setState({
          visible: !!value
        });
      }
      if (value.length < 5) {
        callback('error');
      } else {
        const { form } = this.props;
        if (value && confirmDirty) {
          form.validateFields(['confirm'], { force: true });
          this.setState({
            visible: false
          });
        }
        callback();
      }
    }
  };

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('psw');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={5}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { help, visible, depts, submitting } = this.state;
    const {
      location: { search }
    } = this.props;
    return (
      <div className={styles.main}>
        <h3>
          <FormattedMessage id="app.register.register" />
        </h3>
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('username', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'validation.username.required' })
                },
                {
                  validator: this.checkUsername
                }
              ]
            })(
              <Input
                size="large"
                placeholder={formatMessage({ id: 'form.username.placeholder' })}
              />
            )}
          </FormItem>
          <FormItem help={help}>
            <Popover
              content={
                <div style={{ padding: '4px 0' }}>
                  {passwordStatusMap[this.getPasswordStatus()]}
                  {this.renderPasswordProgress()}
                  <div style={{ marginTop: 10 }}>
                    <FormattedMessage id="validation.password.strength.msg" />
                  </div>
                </div>
              }
              overlayStyle={{ width: 240 }}
              placement="right"
              visible={visible}>
              {getFieldDecorator('psw', {
                rules: [
                  {
                    validator: this.checkPassword
                  }
                ]
              })(
                <Input
                  size="large"
                  type="password"
                  placeholder={formatMessage({
                    id: 'form.password.placeholder'
                  })}
                />
              )}
            </Popover>
          </FormItem>
          <FormItem>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: formatMessage({
                    id: 'validation.confirm-password.required'
                  })
                },
                {
                  validator: this.checkConfirm
                }
              ]
            })(
              <Input
                size="large"
                type="password"
                placeholder={formatMessage({
                  id: 'form.confirm-password.placeholder'
                })}
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('fullname', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'validation.fullname.required' })
                },
                {
                  type: 'string',
                  min: 2,
                  message: formatMessage({
                    id: 'validation.fullname.wrong-format'
                  })
                }
              ]
            })(
              <Input
                size="large"
                placeholder={formatMessage({ id: 'form.fullname.placeholder' })}
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('dept_id', {
              rules: [
                {
                  required: true,
                  message: formatMessage({
                    id: 'validation.dept.required'
                  })
                }
              ]
            })(
              <Select
                size="large"
                placeholder={formatMessage({
                  id: 'validation.dept'
                })}>
                {depts.map(({ id, value }) => (
                  <Option value={id} key={id}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem>
            <Button
              size="large"
              loading={submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit">
              <FormattedMessage id="app.register.register" />
            </Button>
            <Link className={styles.login} to={`/login${search}`}>
              <FormattedMessage id="app.register.sing-in" />
            </Link>
          </FormItem>
        </Form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.common
  };
}

export default connect(mapStateToProps)(Register);
