import React, { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Form, Input, Popover, Progress, notification, Button } from 'antd';
import { connect } from 'dva';
import styles from '@/pages/login/Register.less';
import { passwordStatusMap, passwordProgressMap } from '@/pages/login/register';

const R = require('ramda');
const FormItem = Form.Item;

@connect(({ common: { userSetting } }) => ({
  userSetting
}))
@Form.create()
class SecurityView extends Component {
  state = {
    visible: false,
    help: '',
    confirmDirty: false,
    submitting: false
  };

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('psw');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  checkConfirm = (rule, value, callback) => {
    const {
      form: { getFieldValue }
    } = this.props;
    if (value && value !== getFieldValue('psw')) {
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

  handleSubmit = () => {
    const {
      form: { getFieldsValue },
      userSetting: { uid, username }
    } = this.props;
    const psw = getFieldsValue('psw');
    console.log(psw, uid, username);
  };

  render() {
    const {
      form: { getFieldDecorator }
    } = this.props;

    const { help, visible, submitting } = this.state;

    return (
      <>
        <Form layout="vertical" onSubmit={this.handleSubmit} hideRequiredMark>
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
                  // size="large"
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
                // size="large"
                type="password"
                placeholder={formatMessage({
                  id: 'form.confirm-password.placeholder'
                })}
              />
            )}
          </FormItem>
          <FormItem>
            <Button
              loading={submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit">
              <FormattedMessage id="app.settings.menuMap.security" />
            </Button>
          </FormItem>
        </Form>
      </>
    );
  }
}

export default SecurityView;
