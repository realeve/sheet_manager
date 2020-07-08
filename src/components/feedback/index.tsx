import styles from './index.less';
import React from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { useToggle, useLocation } from 'react-use';
import { connect } from 'dva';
import FormCreater from '@/components/FormCreater';

import { ICommon } from '@/models/common';

const formConfig = {
  name: '问题反馈',
  api: {
    insert: {
      url: '8/b5455c4214.json',
      param: ['ip'],
    },
  },
  table: 'sys_feedback',
  detail: [
    {
      title: '在系统使用中如果遇到系统报错，或者有功能需求及建议，在此提交即可，我们将尽快处理。',
      detail: [
        {
          title: '功能描述',
          type: 'label',
          ignore: true,
          key: 'title',
          span: 24,
        },
        {
          title: '链接地址',
          type: 'label',
          key: 'url',
          span: 24,
        },
        {
          title: '姓名',
          type: 'input',
          key: 'username',
          span: 24,
        },
        {
          title: '问题或建议',
          type: 'input.textarea',
          key: 'remark',
          placeholder: '请在此页面存在的问题或者系统功能建议',
          rule: {
            required: true,
          },
          span: 24,
          rows: 5,
        },
      ],
    },
  ],
};

const Index = ({ user }) => {
  const [on, toggle] = useToggle(false);
  const location = useLocation();

  // console.log({
  //   username: user.fullname,
  //   url: location.href,
  //   remark: '',
  // });

  return (
    <>
      <Modal
        title={null}
        footer={null}
        visible={on}
        centered
        // style={{
        //   right: 10,
        //   position: 'fixed',
        //   height: 360,
        //   top: `calc(100vh - ${360 + 120 + 50}px)`,
        // }}
        onCancel={() => toggle(false)}
        bodyStyle={{ padding: 0 }}
      >
        <FormCreater
          config={formConfig}
          className={styles.form}
          showHeader={false}
          callback={() => toggle(false)}
          value={{
            username: user.fullname,
            url: location.href,
            title: document.title,
            remark: '',
          }}
        />
      </Modal>
      <div className={styles.feedbackHandler} onClick={() => toggle(true)} title="问题反馈">
        <QuestionCircleOutlined style={{ marginLeft: 10 }} />
      </div>
    </>
  );
};

export default connect(({ common: { userSetting: user } }: { common: ICommon }) => ({
  user,
}))(Index);
