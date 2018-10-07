import React, { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Form, Input, Select, Button } from 'antd';
import { connect } from 'dva';
import styles from './BaseView.less';
import * as db from '@/pages/login/service';
import AvatarView from './AvatarView';
const R = require('ramda');

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ common: { userSetting } }) => ({
  userSetting
}))
@Form.create()
class BaseView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      depts: []
    };
  }
  componentDidMount() {
    this.loadDepts();
  }

  loadDepts = async () => {
    db.getSysDept().then(({ data: depts }) => {
      this.setState({
        depts
      });
    });
  };

  getViewDom = ref => {
    this.view = ref;
  };

  getDeptId = () => {
    const {
      userSetting: { dept_name }
    } = this.props;
    const { depts } = this.state;
    let dept = R.find(R.propEq('value', dept_name))(depts);
    return dept ? dept.id : 0;
  };

  render() {
    const {
      form: { getFieldDecorator },
      userSetting: { avatar, fullname }
    } = this.props;
    const { depts } = this.state;
    const dept_id = this.getDeptId();

    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" onSubmit={this.handleSubmit} hideRequiredMark>
            <FormItem
              label={formatMessage({ id: 'form.fullname.placeholder' })}>
              {getFieldDecorator('fullname', {
                rules: [
                  {
                    required: true,
                    message: formatMessage(
                      { id: 'validation.fullname.required' },
                      {}
                    )
                  }
                ],
                initialValue: fullname
              })(<Input />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'validation.dept' })}>
              {getFieldDecorator('dept_id', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({
                      id: 'validation.dept.required'
                    })
                  }
                ],
                initialValue: dept_id
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

            <Button type="primary">
              <FormattedMessage
                id="app.settings.basic.update"
                defaultMessage="Update Information"
              />
            </Button>
          </Form>
        </div>
        <div className={styles.right}>
          <AvatarView avatar={avatar} />
        </div>
      </div>
    );
  }
}

export default BaseView;
