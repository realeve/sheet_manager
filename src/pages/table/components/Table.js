import React, { Component } from "react";
import {
  Table,
  Pagination,
  Card,
  Button,
  Input,
  Menu,
  Dropdown,
  Icon
} from "antd";
import * as db from "../services/table";
import styles from "./Table.less";

import Excel from "../../../utils/excel";
import pdf from "../../../utils/pdf";

const R = require("ramda");

const Search = Input.Search;

class Tables extends Component {
  constructor(props) {
    super(props);
    this.dataClone = [];
    this.dataSearchClone = [];

    this.state = {
      dataSrc: props.dataSrc,
      dataSource: [],
      total: 10,
      page: 1,
      pageSize: 10,
      columns: [],
      source: "",
      timing: "",
      filteredInfo: {},
      sortedInfo: {},
      loading: props.loading
    };
  }

  init = async () => {
    const { page, pageSize, dataSrc } = this.state;
    let data = dataSrc;
    const { source, timing } = data;

    this.setState({
      total: data.rows,
      source,
      timing
    });

    let dataSource = [];

    if (data.rows) {
      if (typeof data.data[0].key === "undefined") {
        data.data = data.data.map((item, key) => {
          let col = { key };
          item.forEach((td, idx) => {
            col["col" + idx] = td;
          });
          return col;
        });
      }
      this.dataClone = data.data;
      dataSource = db.getPageData({ data: this.dataClone, page, pageSize });
    }

    const columns = db.handleColumns(
      {
        dataSrc: data,
        filteredInfo: {}
      },
      this.props.cartLinkMode
    );
    this.setState({
      columns,
      dataSource
    });
    this.dataSearchClone = [];
  };

  componentDidMount() {
    this.init();
  }

  // 待调整，生产周期命名函数
  componentDidUpdate({ dataSrc }, prevState) {
    if (R.equals(dataSrc, prevState.dataSrc)) {
      return;
    }
    this.setState({
      dataSrc
    });
    this.init();
  }

  // 页码更新
  refreshByPage = (page = 1) => {
    const { pageSize } = this.state;
    const dataSource = db.getPageData({ data: this.dataClone, page, pageSize });
    this.setState({
      dataSource,
      page
    });
  };

  // 分页数量调整
  onShowSizeChange = async (current, nextPageSize) => {
    let newPage = Math.max(
      Math.floor((this.state.pageSize * current) / nextPageSize),
      1
    );
    await this.setState({
      pageSize: nextPageSize
    });
    this.refreshByPage(newPage);
  };

  customFilter = async filteredInfo => {
    const { columns, dataSrc } = this.state;

    this.dataClone = db.handleFilter({
      data: dataSrc.data,
      filters: filteredInfo
    });

    let newColumn = db.updateColumns({ columns, filters: filteredInfo });
    await this.setState({
      columns: newColumn,
      filteredInfo,
      total: this.dataClone.length
    });

    this.refreshByPage();
  };

  customSort = async sortedInfo => {
    const { field, order } = sortedInfo;
    if (typeof field === "undefined") {
      return;
    }

    this.dataClone = db.handleSort({ dataClone: this.dataClone, field, order });
    await this.setState({
      sortedInfo
    });
    this.refreshByPage();
  };

  handleChange = (pagination, filters, sorter) => {
    this.customFilter(filters);
    this.customSort(sorter);
  };

  handleSearchChange = async e => {
    const keyword = e.target.value;
    let key = keyword.trim();
    const dataClone = this.dataClone;
    const dataSearchClone = this.dataSearchClone;

    if (key === "") {
      // 如果有数据，还原dataClone;
      // console.log(dataSearchClone);

      if (dataSearchClone.length) {
        this.dataClone = dataSearchClone;
      }
    } else {
      // 先将数据备份存储
      if (dataSearchClone.length === 0) {
        this.dataSearchClone = dataClone;
      } else {
        this.dataClone = dataSearchClone.filter(
          tr =>
            Object.values(tr)
              .slice(1)
              .filter(td => ("" + td).includes(key)).length
        );
      }
    }
    this.refreshByPage();
  };

  getExportConfig = () => {
    const { columns } = this.state;
    const { title } = this.state.dataSrc;

    const header = R.map(R.prop("title"))(columns);
    const filename = `${title}`;
    const keys = header.map((item, i) => "col" + i);
    const body = R.map(R.props(keys))(this.dataClone);
    return {
      filename,
      header,
      body
    };
  };

  downloadExcel = () => {
    const config = this.getExportConfig();
    const xlsx = new Excel(config);
    xlsx.save();
  };

  downloadPdf = () => {
    const config = this.getExportConfig();
    config.download = "download";
    config.title = this.state.dataSrc.title;
    // 自动调整文档方向
    config.orientation =
      this.state.dataSrc.header.length > 7 ? "landscape" : "portrait";
    pdf(config);
  };

  render() {
    const TableBody = () => {
      const {
        loading,
        columns,
        dataSource,
        total,
        page,
        pageSize
      } = this.state;

      const { source, time } = this.state.dataSrc;

      return (
        <>
          <Table
            loading={loading}
            columns={columns}
            dataSource={dataSource}
            rowKey="key"
            pagination={false}
            size="medium"
            onChange={this.handleChange}
            footer={() => `${source} (共耗时${time})`}
          />
          <Pagination
            className="ant-table-pagination"
            showTotal={(total, range) =>
              total ? `${range[0]}-${range[1]} 共 ${total} 条数据` : ""
            }
            showSizeChanger
            onShowSizeChange={this.onShowSizeChange}
            total={total}
            current={page}
            pageSize={pageSize}
            onChange={this.refreshByPage}
            pageSizeOptions={["5", "10", "15", "20", "30", "40", "50", "100"]}
          />
        </>
      );
    };

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
          <Button style={{ marginLeft: 0 }}>
            下载 <Icon type="down" />
          </Button>
        </Dropdown>
      );
    };

    const TableTitle = () => {
      const { title } = this.state.dataSrc;
      return (
        title && (
          <div className={styles.tips}>
            <div className={styles.title}>{title}</div>
            {this.props.subTitle}
          </div>
        )
      );
    };

    return (
      <Card
        title={
          <div className={styles.header}>
            <Action />
            <TableTitle />
            <div className={styles.search}>
              <Search
                placeholder="输入任意值过滤数据"
                onChange={this.handleSearchChange}
                style={{ width: 220, height: 35 }}
              />
            </div>
          </div>
        }
        style={{ width: "100%", marginTop: 20 }}
        bodyStyle={{ padding: "0px 0px 12px 0px" }}
        className={styles.exCard}
      >
        <TableBody />
      </Card>
    );
  }
}

Tables.defaultProps = {
  dataSrc: {
    data: [],
    title: "",
    rows: 0,
    time: "0ms",
    header: []
  },
  loading: false,
  cartLinkMode: "search"
};

export default Tables;
