import React from 'react';
import { formatMessage } from 'umi/locale';
import { Button, Result } from 'antd';
import router from '@/utils/router';
import qs from 'qs';

export const redirectLogin = ({ href, origin }) => {
  router.push({
    pathname: '/login',
    search: qs.stringify({
      redirect: href.replace(origin, ''),
    }),
  });
};

const UnLogin = () => (
  <Result
    status="403"
    title="403"
    subTitle={formatMessage({ id: 'app.exception.description.unlogin' })}
    extra={
      <Button type="primary" onClick={() => redirectLogin(window.location)}>
        {formatMessage({ id: 'app.login.login' })}
      </Button>
    }
  />
);

export default UnLogin;
