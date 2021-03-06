import React, { PureComponent } from 'react';
import { FormattedMessage, formatMessage, setLocale, getLocale } from 'umi/locale';
import { Tag, Tooltip, Button } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import NoticeIcon from '../NoticeIcon';
// import SearchComponent from './SearchComponent';
import AvatarView from './AvatarView';
import { CUR_COMPANY } from '@/utils/setting';

import styles from './index.less';

import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export default class RightContent extends PureComponent {
  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }

  changLang = () => {
    const locale = getLocale();
    if (!locale || locale === 'zh-CN') {
      setLocale('en-US');
    } else {
      setLocale('zh-CN');
    }
  };

  render() {
    const {
      fetchingNotices,
      onNoticeVisibleChange,
      onNoticeClear,
      theme,
      userSetting,
      onMenuClick,
    } = this.props;

    const noticeData = this.getNoticeData();
    let className = cx({
      right: true,
      dark: theme === 'dark',
    });

    /**
     * 是否以完整版打包发布
     * 精简版在header不包含全局搜索，不含质量/生产相关的其它消息提示功能。
     * */
    // const FULL_MODE = BUILD_TYPE !== 'lite';
    const FULL_MODE = BUILD_TYPE !== 'lite' && CUR_COMPANY === 'chengdu';

    return (
      <div className={className}>
        {FULL_MODE && (
          <>
            {/* <SearchComponent /> */}
            <Tooltip title={formatMessage({ id: 'component.globalHeader.help' })}>
              <a
                target="_blank"
                href="/doc/"
                rel="noopener noreferrer"
                className={styles.action}
                title={formatMessage({ id: 'component.globalHeader.help' })}
              >
                <QuestionCircleOutlined />
              </a>
            </Tooltip>
            <NoticeIcon
              className={styles.action}
              // count={currentUser.notifyCount}
              onItemClick={(item, tabProps) => {
                console.log(item, tabProps); // eslint-disable-line
              }}
              onClear={onNoticeClear}
              onPopupVisibleChange={onNoticeVisibleChange}
              loading={fetchingNotices}
              popupAlign={{ offset: [20, -16] }}
            >
              <NoticeIcon.Tab
                list={noticeData.notification}
                title={formatMessage({
                  id: 'component.globalHeader.notification',
                })}
                emptyText={formatMessage({
                  id: 'component.globalHeader.notification.empty',
                })}
                emptyImage="/img/bell.svg"
                tabKey="notification"
              />
              <NoticeIcon.Tab
                list={noticeData.message}
                title={formatMessage({ id: 'component.globalHeader.message' })}
                emptyText={formatMessage({
                  id: 'component.globalHeader.message.empty',
                })}
                emptyImage="/img/notify.svg"
                tabKey="message"
              />
              <NoticeIcon.Tab
                list={noticeData.event}
                title={formatMessage({ id: 'component.globalHeader.event' })}
                emptyText={formatMessage({
                  id: 'component.globalHeader.event.empty',
                })}
                emptyImage="/img/flag.svg"
                tabKey="event"
              />
            </NoticeIcon>
          </>
        )}
        <AvatarView onMenuClick={onMenuClick} userSetting={userSetting} theme={theme} />
        <Button
          size="small"
          ghost={theme === 'dark'}
          style={{
            margin: '0 8px',
          }}
          onClick={() => {
            this.changLang();
          }}
        >
          <FormattedMessage id="navbar.lang" />
        </Button>
      </div>
    );
  }
}
