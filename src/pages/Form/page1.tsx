import React, { useState, useEffect } from 'react';
import FormCreater from '@/components/FormCreater';
import { axios } from '@/utils/axios';
import * as R from 'ramda';
import { Card } from 'antd';

export default function page1() {
  const url = 'http://localhost:8000/form/example.json';
  const [config, setConfig] = useState({});
  useEffect(() => {
    init();
  }, [url]);
  const init = async () => {
    let data = await axios({ url });
    setConfig(data);
  };

  return R.equals(config, {}) ? (
    <Card>
      <h3>请设置表单配置信息</h3>
    </Card>
  ) : (
    <FormCreater config={config} />
  );
}
