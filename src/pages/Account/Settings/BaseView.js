import React, { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Form, Input, Select, Button, message } from 'antd';
import { connect } from 'dva';
import styles from './BaseView.less';
import * as db from '@/pages/login/service';
import AvatarView from './AvatarView';
// import UserPreview from './UserPreview';

const R = require('ramda');
const FormItem = Form.Item;
const { Option } = Select;

@connect(({ common: { userSetting } }) => ({
  userSetting,
}))
@Form.create()
class BaseView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      depts: [],
      submitting: false,
    };
  }
  componentDidMount() {
    this.loadDepts();
  }

  loadDepts = async () => {
    db.getSysDept().then(({ data: depts }) => {
      this.setState({
        depts,
      });
    });
  };

  getDeptId = () => {
    const {
      userSetting: { dept_name },
    } = this.props;
    const { depts } = this.state;
    let dept = R.find(R.propEq('value', dept_name))(depts);
    return dept ? dept.id : 0;
  };

  handleSubmit = async () => {
    this.setState({
      submitting: true,
    });
    const {
      form: { getFieldsValue },
      userSetting: { username, uid: _id },
    } = this.props;
    const { dept_id, fullname } = getFieldsValue();

    const {
      data: [{ affected_rows }],
    } = await db
      .setSysUserBase({
        fullname,
        dept_id,
        _id,
        username,
      })
      .finally(e => {
        this.setState({ submitting: false });
      });

    if (affected_rows) {
      message.success('个人信息更新成功!');
    } else {
      message.error('个人信息更新失败!');
    }
    db.reLogin(this.props.dispatch);
  };

  render() {
    const {
      form: { getFieldDecorator },
      userSetting: { avatar, fullname, dept_name },
    } = this.props;
    const { depts, submitting } = this.state;
    const dept_id = this.getDeptId();
    return (
      <div className={styles.baseView}>
        <div className={styles.left}>
          <Form layout="vertical">
            <FormItem label={formatMessage({ id: 'form.fullname.placeholder' })}>
              {getFieldDecorator('fullname', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.fullname.required' }, {}),
                  },
                ],
                initialValue: fullname,
              })(<Input />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'validation.dept' })}>
              {getFieldDecorator('dept_id', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({
                      id: 'validation.dept.required',
                    }),
                  },
                ],
                initialValue: dept_id,
              })(
                <Select
                  size="large"
                  placeholder={formatMessage({
                    id: 'validation.dept',
                  })}
                >
                  {depts.map(({ id, value }) => (
                    <Option value={id} key={id}>
                      {value}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>

            <Button loading={submitting} type="primary" onClick={this.handleSubmit}>
              <FormattedMessage
                id="app.settings.basic.update"
                defaultMessage="Update Information"
              />
            </Button>
          </Form>
        </div>
        <div className={styles.right}>
          <AvatarView avatar={avatar} />
          {/* <UserPreview
            {...{ avatar, dept_name, fullname }}
            style={{ maxHeight: 300, marginLeft: 20 }}
          /> */}
        </div>
      </div>
    );
  }
}

export default BaseView;
