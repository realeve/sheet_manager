import React, { useState, useEffect } from 'react';
import FormCreater from '@/components/FormCreater';
import { Card, Tabs } from 'antd';
import qs from 'qs';
import useFetch from '@/components/hooks/useFetch';
import * as lib from '@/utils/lib';

const callback = (res, setNeedRefresh) => {
  // 集中处理detail字段，对其中scope字段一个key有多个字段的数据打散
  res.detail = res.detail.map(detail => {
    detail.detail = detail.detail.map(item => {
      // input/label中有url时，强制刷新
      if (['input', 'input.number', 'label'].includes(item.type) && item.url) {
        setNeedRefresh(true);
      }
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
  const [needRefresh, setNeedRefresh] = useState(false);
  let url: string = res.id || '';
  const { data } = useFetch({
    param: { url },
    valid: () => url.length > 0,
    callback: res => {
      setNeedRefresh(false);
      if (lib.getType(res) == 'array') {
        return res.map(item => callback(item, setNeedRefresh));
      }
      return callback(res, setNeedRefresh);
    },
  });

  const [innerTrigger, setInnerTrigger] = useState(lib.timestamp());
  useEffect(() => {
    if (!needRefresh) {
      return;
    }
    setInnerTrigger(lib.timestamp());
  }, [needRefresh]);

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

  // console.log(lib.getType(data), data);
  if (lib.getType(data) === 'array') {
    return (
      <Tabs defaultActiveKey="0" type="line">
        {data.map((item, idx) => (
          <Tabs.TabPane tab={item.name} key={String(idx)}>
            <FormCreater
              config={item}
              // parentConfig={parentConfig}
              // setParentConfig={setParentConfig}
              // shouldConnect
              innerTrigger={innerTrigger}
              setInnerTrigger={setInnerTrigger}
              tabId={idx}
            />
          </Tabs.TabPane>
        ))}
      </Tabs>
    );
  }

  return (
    <FormCreater
      config={data}
      innerTrigger={innerTrigger}
      setInnerTrigger={setInnerTrigger}
      tabId={-1}
    />
  );
}
