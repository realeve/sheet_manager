import React, { useState, useEffect } from 'react';
import FormCreater from '@/components/FormCreater';
import { axios } from '@/utils/axios';
import * as R from 'ramda';
import { Card } from 'antd';
import qs from 'qs';

// http://localhost:8000/form#id=./form/example2.json
export default function page(): JSX.Element {
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

  return R.equals(config, {}) || ['undefined', 'string'].includes(typeof config) ? (
    <Card>
      <h3>请设置表单配置信息</h3>
      <p>
        可尝试访问示例链接：
        <a href="/form#id=./data/paper/pulpboard.json">/form#id=./data/paper/pulpboard.json</a>
      </p>
    </Card>
  ) : (
    <FormCreater config={config} />
  );
}
