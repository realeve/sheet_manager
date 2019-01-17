import React from 'react';
import { formatMessage } from 'umi/locale';
import Exception from 'ant-design-pro/lib/Exception';
import { Button } from 'antd';
// import router from 'umi/router'; -- 这样会报错
import router from '@/utils/router';
import qs from 'qs';

const redirectLogin = () => {
  let { href, origin } = window.location;

  router.push({
    pathname: '/login',
    search: qs.stringify({
      redirect: href.replace(origin, ''),
    }),
  });
};
const actions = (
  <div>
    <Button type="primary" onClick={redirectLogin}>
      {formatMessage({ id: 'app.login.login' })}
    </Button>
  </div>
);

const UnLogin = () => (
  <Exception
    type="403"
    desc={formatMessage({ id: 'app.exception.description.unlogin' })}
    img="/img/403.svg"
    actions={actions}
    title="401"
  />
);

export default UnLogin;
