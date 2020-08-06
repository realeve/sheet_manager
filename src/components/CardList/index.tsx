import React, { ReactNode } from 'react';
import styles from './index.less';
import { Card, List, Tabs } from 'antd';
import { ListItemFull } from '@/pages/Search/components/SimpleList';
import * as R from 'ramda';

import { Skeleton, Empty } from 'antd';

const { TabPane } = Tabs;

const groupData = (data, param) => {
  return R.groupBy(R.prop(param))(data.data);
};

const CardListItem = ({
  data,
  loading = false,
  spaceBetween = false,
  beforeRender,
  removeZero,
}) => (
  <div className={styles.cardList}>
    <List
      rowKey="id"
      loading={loading}
      grid={{ gutter: 12, lg: 4, md: 2, sm: 1, xs: 1 }}
      dataSource={(data && data.data) || []}
      renderItem={(item: string[], idx: number) => {
        const isSpecialProd = item.join('').includes('9603T') || item.join('').includes('NRB');

        return (
          <List.Item key={idx}>
            <Card
              hoverable
              className={styles.card}
              bodyStyle={{ background: isSpecialProd ? '#f1fcff' : 'unset' }}
            >
              <ListItemFull
                spaceBetween={spaceBetween}
                header={data.header}
                data={item}
                span={24}
                beforeRender={beforeRender}
                removeZero={removeZero}
              />
            </Card>
          </List.Item>
        );
      }}
    />
  </div>
);

const handleData = (data, group) => {
  let res = groupData(data, group);
  return Object.keys(res).map(key => {
    let item = res[key];
    return {
      ...data,
      data: item,
      rows: item.length,
      tabTitle: key,
    };
  });
};

const GroupCardList = ({ data, group, spaceBetween = false, beforeRender, removeZero }) => (
  <Tabs defaultActiveKey="1" type="line">
    {handleData(data, group).map(item => (
      <TabPane tab={item.tabTitle} key={item.tabTitle}>
        <CardListItem
          data={item}
          spaceBetween={spaceBetween}
          beforeRender={beforeRender}
          removeZero={removeZero}
        />
      </TabPane>
    ))}
  </Tabs>
);

export default ({
  group,
  data: list,
  loading = false,
  subTitle = null,
  spaceBetween = false,
  beforeRender = null,
  removeZero = false,
}: {
  group?: string | number;
  data: any;
  loading?: boolean;
  subTitle?: ReactNode;
  spaceBetween?: boolean;
  beforeRender?: null | ((id: string) => ReactNode);
  removeZero?: boolean;
}) => {
  // 载入数据
  if (loading || R.isNil(list) || R.isNil(list.data)) {
    return <Skeleton active />;
  }

  return (
    <div>
      <h3
        style={{
          fontSize: 24,
          marginLeft: 5,
          marginBottom: 0,
        }}
      >
        {list?.title}
        {subTitle && <small style={{ marginLeft: 5, fontSize: 14 }}>{subTitle}</small>}
      </h3>
      {typeof group !== 'undefined' ? (
        <GroupCardList
          data={list}
          group={group}
          spaceBetween={spaceBetween}
          beforeRender={beforeRender}
          removeZero={removeZero}
        />
      ) : (
        <CardListItem
          data={list}
          loading={loading}
          spaceBetween={spaceBetween}
          beforeRender={beforeRender}
          removeZero={removeZero}
        />
      )}
      {!list ||
        (list.rows === 0 && (
          <Empty style={{ padding: 20 }} description="查询无结果，请更换检索日期重试" />
        ))}
    </div>
  );
};
