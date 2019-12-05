import React, { Component } from 'react';
import { Table, Pagination, Card, Button, Input, Menu, Dropdown, Icon, Form, Switch } from 'antd';
import * as db from '@/services/table';
import styles from './Table.less';
import * as setting from '../utils/setting';
import pdf from '../utils/pdf';
import * as lib from '../utils/lib';
import { formatMessage } from 'umi/locale';
import * as Excel from '@/utils/exceljs';
import { connect } from 'dva';
import Err from '@/components/Err';

import Sheet from '@/components/TableSheet';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';

const R = require('ramda');

const Search = Input.Search;
const FormItem = Form.Item;

// 获取表头层级数，用于sheet的表头处理

const getNestHeader = tableColumn => {
  const handleItem = item => {
    if (!item.children) {
      return item.title;
    }
    return {
      label: item.title,
      colspan: item.children.length,
      children: getNestHeader(item.children),
    };
  };

  let header = tableColumn.map(item => handleItem(item));

  return header;
}; // let maxLevel = getColumnLevel(tableColumn);
// header.map(row => {
//   let len = row.length;
//   for (let i = len; i < maxLevel; i++) {
//     row.push(R.last(row));
//   }
//   return row;
// });
@connect(({ common: { userSetting: { dept_name, fullname } } }) => ({
  dept_name,
  fullname,
}))
class Tables extends Component {
  constructor(props) {
    super(props);
    this.state = db.initState(props);
  }

  // 返回的值即是当前需要setState的内容
  static getDerivedStateFromProps(
    props,
    { page, pageSize, dataSrc, columns, dataClone, dataSearchClone, dataSource, total }
  ) {
    if (R.equals(props.dataSrc, dataSrc)) {
      return { loading: props.loading };
    }

    return {
      ...db.updateState(props, { page, pageSize, columns }, props.merge),
      dataClone,
      dataSearchClone,
      dataSource,
      total,
    };
  }

  // 页码更新
  refreshByPage = (page = 1) => {
    const isAntd = window.location.hash.includes('theme=antd');

    const { pageSize, dataSource, dataClone } = this.state;
    const dataSourceNew = isAntd
      ? db.getPageData({
          data: dataClone,
          page,
          pageSize,
        })
      : dataClone;

    if (R.equals(dataSourceNew, dataSource)) {
      return;
    }
    this.setState({
      dataSource: dataSourceNew,
      page,
    });
  };

  // 分页数量调整
  onShowSizeChange = (current, nextPageSize) => {
    let newPage = Math.max(Math.floor((this.state.pageSize * current) / nextPageSize), 1);
    this.setState(
      {
        pageSize: nextPageSize,
      },
      () => {
        this.refreshByPage(newPage);
      }
    );
  };

  customFilter = filters => {
    // const dataSrc = this.dataSrc;
    const { columns, dataSrc } = this.state;

    let dataClone = db.handleFilter({
      data: dataSrc.data,
      filters,
    });

    let newColumn = db.updateColumns({
      columns,
      filters,
    });

    this.setState(
      {
        dataClone,
        columns: newColumn,
        filteredInfo: filters,
        total: dataClone.length,
      },
      () => {
        this.refreshByPage();
      }
    );
  };

  customSort = sortedInfo => {
    const { field, order } = sortedInfo;
    if (typeof field === 'undefined') {
      return;
    }

    let dataClone = db.handleSort({
      dataClone: this.state.dataClone,
      field,
      order,
    });

    this.setState(
      {
        sortedInfo,
        dataClone,
      },
      () => {
        this.refreshByPage();
      }
    );
  };
  @Bind()
  @Debounce(500, {
    leading: true,
    trailing: false,
  })
  handleChange = (pagination, filters, sorter) => {
    this.customFilter(filters);
    this.customSort(sorter);
  };

  handleSearchChange = e => {
    const keyword = e.target.value;
    let key = keyword.trim();
    let { dataClone, dataSearchClone } = this.state;

    if (key === '') {
      if (dataSearchClone.length) {
        dataClone = dataSearchClone;
      }
    } else {
      // 先将数据备份存储
      if (dataSearchClone.length === 0) {
        dataSearchClone = R.clone(dataClone);
      } else {
        dataClone = dataSearchClone.filter(
          tr =>
            Object.values(tr)
              .slice(1)
              .filter(td => String(td).includes(key)).length
        );
      }
    }

    this.setState(
      {
        dataClone,
        dataSearchClone,
        total: dataClone.length,
      },
      () => {
        this.refreshByPage();
      }
    );
  };

  getExportConfig = () => {
    const { title, source, header, ...props } = R.clone(this.state.dataSrc);
    const filename = `${title}`;
    const keys = header.map((item, i) => 'col' + i);
    const body = R.compose(
      R.map(item => R.map(a => (lib.hasDecimal(a) ? parseFloat(a) : a))(item)),
      R.map(R.props(keys))
    )(this.state.dataClone);

    const { dept_name, fullname } = this.props;
    const creator = `${dept_name} ${fullname}`;

    // 将外部数据接口中的merge配置信息注入替换
    let params = R.clone(this.props.config);
    params = Object.assign({}, params, R.pick(['merge', 'mergesize', 'mergetext'], props));

    return {
      columns: this.state.columns,
      creator,
      source,
      filename,
      header,
      body,
      params,
      extra: this.props.extra,
    };
  };

  downloadExcel = () => {
    const config = this.getExportConfig();
    Excel.save(config);
  };

  downloadPdf = () => {
    let { title, source } = this.state.dataSrc;
    const { subTitle } = this.props;
    let config = this.getExportConfig();
    let queryTime = '下载时间：' + lib.now();
    config = Object.assign(config, {
      download: 'open',
      title,
      orientation: config.header.length > 10 ? 'landscape' : 'portrait',
      pageSize: config.header.length > 10 ? 'A2' : config.header.length > 15 ? 'A3' : 'A4',
      message: `\n${subTitle || ''}\n${queryTime}\n${source}\n(c) ${setting.AUTHOR}`,
    });
    pdf(config);
  };

  // 为每行增加自定义附加操作
  appendActions = columns => {
    if (!this.props.actions) {
      return columns;
    }

    let actions = this.props.actions.map(({ title, render }, idx) => ({
      title,
      key: 'col' + (columns.length + idx),
      dataIndex: 'col' + (columns.length + idx),
      render: (text, record) => render(record),
    }));
    return [...columns, ...actions];
  };

  getTBody = isAntd => {
    const {
      loading,
      columns,
      dataSource,
      source,
      timing,
      total,
      page,
      pageSize,
      bordered,
    } = this.state;

    if (!isAntd) {
      let { data, ...src } = this.props.dataSrc;
      let nextData = R.map(item => Object.values(item).slice(1), dataSource);
      return <Sheet data={{ data: nextData, ...src }} />;
    }

    let scroll = {};
    let len = R.isNil(dataSource[0]) ? 0 : Object.values(dataSource[0]).length;
    let needScroll = len > 0;
    if (needScroll) {
      scroll = {
        x: len * 50 + 200,
      };
    }
    // if (pageSize > 15) {
    //   scroll.y = 700;
    // }
    let tableColumn = this.appendActions(columns);
    if (this.props.beforeRender) {
      tableColumn = this.props.beforeRender(tableColumn);
    }
    // let nestedHeaders = getNestHeader(tableColumn);
    // console.log(tableColumn, nestedHeaders);

    return (
      <>
        <Table
          loading={loading}
          columns={tableColumn}
          dataSource={dataSource}
          rowKey="key"
          pagination={false}
          size="small"
          bordered={bordered}
          scroll={scroll}
          onChange={this.handleChange}
          footer={() =>
            !this.props.simple && (
              <p style={{ padding: '5px 16px' }}>
                {source} (共耗时{timing})
              </p>
            )
          }
        />
        <Pagination
          className="ant-table-pagination"
          showTotal={(total, range) => (total ? `${range[0]}-${range[1]} 共 ${total} 条数据` : '')}
          showSizeChanger
          onShowSizeChange={this.onShowSizeChange}
          total={total}
          current={page}
          pageSize={pageSize}
          onChange={this.refreshByPage}
          pageSizeOptions={['10', '20', '50', '100', '400']}
        />
      </>
    );
  };

  tblTitle = () => {
    const { subTitle } = this.props;
    const { title } = this.state.dataSrc;
    return (
      title && (
        <div className={styles.tips}>
          <div className={styles.title}> {title} </div>
          <div className={styles.subTitle}>
            <small>{subTitle}</small>
          </div>
        </div>
      )
    );
  };

  handleToggle = prop => {
    return enable => {
      let key = '_tbl_' + prop;
      window.localStorage.setItem(key, enable ? 1 : 0);
      this.setState({ [prop]: enable });
    };
  };

  render() {
    if (this.props.dataSrc.err) {
      return <Err err={this.props.dataSrc.err} />;
    }

    const isAntd = window.location.hash.includes('theme=antd');
    const tBody = this.getTBody(isAntd);
    const tTitle = this.tblTitle();

    const Action = () => {
      const menu = (
        <Menu>
          <Menu.Item>
            <a rel="noopener noreferrer" onClick={this.downloadExcel}>
              <Icon type="file-excel" />
              excel
            </a>
          </Menu.Item>
          <Menu.Item>
            <a rel="noopener noreferrer" onClick={this.downloadPdf}>
              <Icon type="file-pdf" />
              PDF
            </a>
          </Menu.Item>
        </Menu>
      );
      return (
        <Dropdown overlay={menu}>
          <Button
            style={{
              marginLeft: 0,
            }}
          >
            {formatMessage({ id: 'table.download' })} <Icon type="down" />
          </Button>
        </Dropdown>
      );
    };
    let notSimple = !this.props.simple;

    const TableSetting = () =>
      !notSimple
        ? !!this.props.showDownload && (
            <div style={{ marginTop: 10 }}>
              <Action />
            </div>
          )
        : isAntd && (
            <Form layout="inline" className={styles.tblSetting} style={{ paddingLeft: 15 }}>
              <FormItem label={formatMessage({ id: 'table.border' })}>
                <Switch checked={this.state.bordered} onChange={this.handleToggle('bordered')} />
              </FormItem>
            </Form>
          );

    let SearchFilter = (
      <div className={styles.search}>
        <Search
          placeholder={formatMessage({ id: 'table.filter' })}
          onChange={this.handleSearchChange}
          size="small"
          style={{
            width: 170,
          }}
        />
      </div>
    );
    let tableTitle = !notSimple ? (
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
        {SearchFilter}
      </div>
    ) : (
      <>
        <div className={styles.header}>
          <div>
            <Action />
            <a
              target="_blank"
              href="/table/config"
              rel="noopener noreferrer"
              className={styles.action}
              style={{ marginLeft: 10 }}
              title=""
            >
              <Icon type="question-circle-o" />
            </a>
          </div>
          {tTitle}
          {SearchFilter}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {lib.getTableExtraLabel(this.props.extra).map(item => (
            <span style={{ fontSize: 13, fontWeight: 400 }} key={item}>
              {item}
            </span>
          ))}
        </div>
      </>
    );

    return (
      <Card
        bordered={false}
        title={tableTitle}
        style={{
          width: '100%',
          marginTop: 0,
        }}
        bodyStyle={{
          padding: '0px',
        }}
        className={styles.exCard}
      >
        {tBody}
        <TableSetting />
      </Card>
    );
  }
}

Tables.defaultProps = {
  dataSrc: {
    data: [],
    title: '',
    rows: 0,
    time: '0ms',
    header: [],
  },
  extra: {
    data: [],
    title: '',
    rows: 0,
    time: '0ms',
    header: [],
  },
  loading: false,
  cartLinkPrefix: setting.searchUrl,
  actions: false,
  subTitle: '',
  config: {
    prefix: '',
    suffix: '',
    autoid: true,
    interval: 5,
  },
  merge: true,
};

export default Tables;
