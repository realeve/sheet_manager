import React from 'react';
import Link from 'umi/link';
import Exception from 'ant-design-pro/lib/Exception';
import 'ant-design-pro/dist/ant-design-pro.css'; // 统一引入样式
export default () => (
  <Exception
    type="404"
    style={{ minHeight: 500, height: '100%' }}
    linkElement={Link}
    img="/img/404.svg"
  />
);
