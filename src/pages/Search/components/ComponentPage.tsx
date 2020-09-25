import React from 'react';
import { Empty } from 'antd';
import Err from '@/components/Err';

export default ({ data: res, children }) => {
  return res.error || res.err ? (
    <Err err={res.error || res.err} />
  ) : res?.data?.rows === 0 ? (
    <Empty description="查询无结果，请更换查询条件重试" />
  ) : (
    children
  );
};
