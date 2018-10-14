import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Row, Col } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './Center.less';

import UserPreview from '../Settings/UserPreview';
@connect(({ common: { userSetting } }) => ({
  userSetting
}))
class Center extends PureComponent {
  // componentDidMount() {
  //   const { dispatch } = this.props;
  // }

  onTabChange = key => {
    const { match } = this.props;
    switch (key) {
      case 'articles':
        router.push(`${match.url}/articles`);
        break;
      case 'applications':
        router.push(`${match.url}/applications`);
        break;
      case 'projects':
        router.push(`${match.url}/projects`);
        break;
      default:
        break;
    }
  };

  render() {
    const { listLoading, match, location, children, userSetting } = this.props;

    const operationTabList = [
      {
        key: 'articles',
        tab: (
          <span>
            文章 <span style={{ fontSize: 14 }}>(8)</span>
          </span>
        )
      },
      {
        key: 'applications',
        tab: (
          <span>
            应用 <span style={{ fontSize: 14 }}>(8)</span>
          </span>
        )
      },
      {
        key: 'projects',
        tab: (
          <span>
            项目 <span style={{ fontSize: 14 }}>(8)</span>
          </span>
        )
      }
    ];

    const {
      userSetting: { avatar, fullname, dept_name }
    } = this.props;

    return (
      <GridContent className={styles.userCenter}>
        <Row gutter={24}>
          <Col lg={5} md={24}>
            <UserPreview
              style={{ marginBottom: 24, minHeight: 300 }}
              {...{ avatar, fullname, dept_name }}
            />
          </Col>
          <Col lg={19} md={24}>
            <Card
              className={styles.tabsCard}
              bordered={false}
              tabList={operationTabList}
              activeTabKey={location.pathname.replace(`${match.path}/`, '')}
              onTabChange={this.onTabChange}
              loading={listLoading}>
              {children}
            </Card>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default Center;
