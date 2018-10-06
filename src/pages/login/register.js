import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import { Form, Input, Button, Popover, Progress, Select } from 'antd';
import styles from './Register.less';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;

const passwordStatusMap = {
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

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception'
};

@connect(({ register, loading }) => ({
  register,
  submitting: loading.effects['register/submit']
}))
@Form.create()
class Register extends Component {
  state = {
    count: 0,
    confirmDirty: false,
    visible: false,
    help: ''
  };

  componentDidUpdate() {
    const { form } = this.props;
    const account = form.getFieldValue('username');
    console.log(account);
    // if (register.status === 'ok') {
    //   router.push({
    //     pathname: '/user/register-result',
    //     state: {
    //       account
    //     }
    //   });
    // }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
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
    const { form, dispatch } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        const { prefix } = this.state;
        dispatch({
          type: 'register/submit',
          payload: {
            ...values,
            prefix
          }
        });
      }
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    const { confirmDirty } = this.state;
    this.setState({ confirmDirty: confirmDirty || !!value });
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback(formatMessage({ id: 'validation.password.twice' }));
    } else {
      callback();
      this.setState({
        visible: false
      });
    }
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
        console.log(value);
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
    const value = form.getFieldValue('password');
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
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    const { help, visible } = this.state;
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
                  // type: 'string',
                  pattern: /[a-z]||[A-Z]||[0-9]||_/,
                  min: 4,
                  message: formatMessage({
                    id: 'validation.username.wrong-format'
                  })
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
              {getFieldDecorator('password', {
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
            {getFieldDecorator('dept', {
              rules: [
                {
                  required: true,
                  message: formatMessage({
                    id: 'validation.dept.required'
                  })
                }
              ]
            })(
              <Select size="large" 
              placeholder={formatMessage({
                id: 'validation.dept'
              })}>
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
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
