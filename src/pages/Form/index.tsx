import React, { useState, useEffect } from 'react';
import FormCreater, { IFormConfig } from '@/components/FormCreater';
import { Card, Tabs } from 'antd';
import qs from 'qs';
import useFetch from '@/components/hooks/useFetch';
import * as lib from '@/utils/lib';
import styles from './index.less';

const callback = (
  res: IFormConfig,
  setNeedRefresh: React.Dispatch<React.SetStateAction<boolean>>
) => {
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
        if (typeof opt === 'string' || !opt.scope) {
          return opt;
        }
        let scope = [];
        opt.scope.forEach(({ key, ...optItem }) => {
          if (Array.isArray(key)) {
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
export default () => {
  let res: { id?: string } = qs.parse(window.location.hash.slice(1));
  const [needRefresh, setNeedRefresh] = useState(false);
  let url: string = res.id || '';
  const { data } = useFetch<IFormConfig | IFormConfig[]>({
    param: { url },
    valid: () => url.length > 0,
    callback: res => {
      setNeedRefresh(false);
      if (lib.getType(res) == 'array') {
        return res.map(item => {
          if (lib.getType(item) == 'array') {
            return item.map(config => callback(config, setNeedRefresh));
          } else {
            return callback(item, setNeedRefresh);
          }
        });
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

  const FormItem = ({ item, idx = -1 }: { item: IFormConfig | IFormConfig[]; idx?: number }) =>
    Array.isArray(item) ? (
      <div className={styles.alignColumn}>
        {item.map((formConfig, id) => (
          <FormCreater
            config={formConfig}
            innerTrigger={innerTrigger}
            setInnerTrigger={setInnerTrigger}
            key={String(id)}
            tabId={idx}
            className={styles.item}
            showHeader={id == 0}
          />
        ))}
      </div>
    ) : (
      <FormCreater
        config={item}
        innerTrigger={innerTrigger}
        setInnerTrigger={setInnerTrigger}
        tabId={idx}
        showHeader={idx == 0}
      />
    );

  if (Array.isArray(data)) {
    return (
      <Tabs defaultActiveKey="0" type="line">
        {data.map((item, idx) => (
          <Tabs.TabPane tab={item?.name || item[0]?.name} key={String(idx)}>
            <FormItem item={item} idx={idx} />
          </Tabs.TabPane>
        ))}
      </Tabs>
    );
  }

  return <FormItem item={data} />;
};
