import React from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Button } from 'antd';
import Link from 'umi/link';
import Result from 'ant-design-pro/lib/Result';
import styles from './forget.less';

const actions = (
  <div className={styles.actions}>
    <Link to="/">
      <Button size="large" type="primary">
        <FormattedMessage id="app.register-result.back" />
      </Button>
    </Link>
  </div>
);

const RegisterResult = ({
  location: {
    state: { account, forget }
  }
}) => (
  <Result
    className={styles.registerResult}
    type="success"
    title={
      <div className={styles.title}>
        <FormattedMessage
          id={forget ? 'app.register-result.hello' : 'app.register-result.msg'}
          values={{
            username: account || '测试用户'
          }}
        />
      </div>
    }
    description={formatMessage({ id: 'app.register-result.activation-email' })}
    actions={actions}
    style={{ marginTop: 56 }}
  />
);

export default RegisterResult;
