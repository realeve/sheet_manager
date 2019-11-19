import React, { useState, useEffect } from 'react';
import FormCreater from '@/components/FormCreater';
import { axios } from '@/utils/axios';
import * as R from 'ramda';
import { Card } from 'antd';
import qs from 'qs';

// http://localhost:8000/form/page1#id=./form/example2.json
export default function page1(): JSX.Element {
  let res: { id?: string } = qs.parse(window.location.hash.slice(1));
  let url: string = res.id || '';
  const [config, setConfig]: [{}, any] = useState({});
  useEffect(() => {
    init();
  }, [url]);
  const init = async () => {
    if (url.length === 0) {
      return;
    }
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
