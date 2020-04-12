import React, { useState } from 'react';
import FormCreater from '@/components/FormCreater';
import { Card, Tabs } from 'antd';
import qs from 'qs';
import useFetch from '@/components/hooks/useFetch';
import * as lib from '@/utils/lib';

const callback = res => {
  // 集中处理detail字段，对其中scope字段一个key有多个字段的数据打散

  res.detail = res.detail.map(detail => {
    detail.detail = detail.detail.map(item => {
      if (!item.defaultOption) {
        return item;
      }
      item.defaultOption.map(opt => {
        if (!opt.scope) {
          return opt;
        }
        let scope = [];
        opt.scope.forEach(({ key, ...optItem }) => {
          if (lib.getType(key) === 'array') {
            // 将数据打散
            scope = [
              ...scope,
              ...key.map(keyName => ({
                key: keyName,
                ...optItem,
              })),
            ];
          } else {
            scope = [
              ...scope,
              {
                key,
                ...optItem,
              },
            ];
          }
        });
        opt.scope = scope;
        return opt;
      });
      return item;
    });
    return detail;
  });
  return res;
};

// http://localhost:8000/form#id=./form/example2.json
export default function page(): JSX.Element {
  let res: { id?: string } = qs.parse(window.location.hash.slice(1));
  let url: string = res.id || '';
  const { data } = useFetch({
    param: { url },
    valid: () => url.length > 0,
    callback: res => {
      if (lib.getType(res) == 'array') {
        return res.map(callback);
      }
      callback(res);
    },
  });

  const [parentConfig, setParentConfig] = useState({
    hide: [],
    scope: [],
  });

  if (!data) {
    return (
      <Card>
        <h3>请设置表单配置信息</h3>
        <p>
          可尝试访问示例链接：
          <a href="/form#id=./data/paper/pulpboard.json">/form#id=./data/paper/pulpboard.json</a>
        </p>
      </Card>
    );
  }

  if (lib.getType(data) === 'array') {
    return (
      <Tabs defaultActiveKey="0" type="line">
        {data.map((item, idx) => (
          <Tabs.TabPane tab={item.name} key={String(idx)}>
            <FormCreater
              config={item}
              parentConfig={parentConfig}
              setParentConfig={setParentConfig}
              shouldConnect
            />
          </Tabs.TabPane>
        ))}
      </Tabs>
    );
  }

  return <FormCreater config={data} />;
}
