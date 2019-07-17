import React from 'react';
import * as lib from '../utils/lib';
import styles from '../components/Table.less';
import * as setting from '../utils/setting';
import * as R from 'ramda';

const isFilterColumn: <T>(
  data: Array<any>,
  key: T
) => { uniqColumn: Array<T>; filters: boolean } = (data, key) => {
  let isValid: boolean = true;

  const handleItem: (item: string | number | null) => void = item => {
    if (R.isNil(item)) {
      isValid = false;
    }
    if (isValid) {
      let str: string = String(item).trim();
      let isNum: boolean = lib.isNumOrFloat(str);
      let isTime: boolean = lib.isDateTime(str);
      if (isNum || isTime) {
        isValid = false;
      }
      if (str.includes('image')) {
        isValid = false;
      }
    }
  };

  let uniqColumn = R.compose(
    R.uniq,
    R.map(R.prop(key))
  )(data);

  R.forEach(handleItem)(uniqColumn);

  return {
    uniqColumn,
    filters: isValid,
  };
};

export function handleColumns(
  { dataSrc, filteredInfo },
  cartLinkPrefix = setting.searchUrl,
  imgHost = null,
  merge = [],
  simpleMode = false
) {
  let { data, header, rows } = dataSrc;
  if (!rows || rows === 0) {
    return [];
  }
  let showURL: boolean = typeof data !== 'undefined';

  let column = header.map((title, i) => {
    let key = 'col' + i;
    let item: {
      title: string;
      dataIndex?: string;
      sorter?: Function;
      render?: (text: string) => any;
      filters?: Array<{
        text: string;
        value: string;
      }>;
      onFilter?: Function;
      filteredValue?: any;
    } = {
      title,
    };

    item.dataIndex = key;
    // item.key = key;

    if (!showURL) {
      return item;
    }

    let tdValue = data[0][key];

    if (lib.isNumOrFloat(tdValue)) {
      item.sorter = (a, b) => a[key] - b[key];
    }
    else {
      item.sorter = (a, b) => String(a[key]).localeCompare(b[key]);
    }

    const isCart: boolean = lib.isCart(tdValue);
    if (lib.isReel(tdValue) || isCart) {
      item.render = text => {
        let url = cartLinkPrefix;
        let attrs: {
          href: string;
          target?: string;
        } = {
          href: url + text,
        };
        if (!simpleMode) {
          attrs.target = '_blank';
        }
        return <a {...attrs}> {text} </a>;
      };
      return item;
    } else if (lib.isInt(tdValue) && !lib.isDateTime(tdValue) && !lib.isMonth(tdValue)) {
      item.render = text => Number(text).toLocaleString();
      return item;
    } else if (lib.hasDecimal(tdValue)) {
      item.render = text => parseFloat(text);
      return item;
    } else {
      item.render = text => {
        text = R.isNil(text) ? '' : text;
        let isImg = String(text).includes('image/') || String(text).includes('/file/');
        let isBase64Image =
          String(text).includes('data:image/') && String(text).includes(';base64');
        let hostUrl = isBase64Image ? '' : (imgHost || setting.uploadHost);

        return !isImg ? (
          text
        ) : (
            <img className={styles.imgContent} src={`${hostUrl}${text}`} alt={text} />
          );
      };
    }

    let fInfo = isFilterColumn(data, key);

    if (filteredInfo && fInfo.filters) {
      item.filters = fInfo.uniqColumn.map(text => ({
        text,
        value: text,
      }));

      item.onFilter = (value, record) => record[key].includes(value);
      item.filteredValue = filteredInfo[key] || null;
    }
    return item;
  });

  // 10列以上自动固定表头，此处还需要调整 
  // if (column.length > 15) {
  //   column = column.map(item => {
  //     item.width = 80;
  //     return item;
  //   });

  //   let fixedHeaders: Array<number> = column[0].title == 'id' ? [0, 1] : [0];

  //   fixedHeaders.forEach(id => {
  //     column[id] = Object.assign(column[id], {
  //       fixed: 'left',
  //     });
  //   });
  // }

  return column;
}

export function handleFilter({ data, filters }) {
  R.compose(
    R.forEach(key => {
      if (filters[key] !== null && filters[key].length !== 0) {
        data = R.filter(item => filters[key].includes(item[key]))(data);
      }
    }),
    R.keys
  )(filters);
  return data;
}

export function updateColumns({ columns, filters }) {
  R.compose(
    R.forEach(key => {
      let idx = R.findIndex(R.propEq('dataIndex', key))(columns);
      const filterVal = filters[key];
      if (idx > -1) {
        columns[idx].filteredValue = filterVal;
      } else {
        // 有嵌套表格
        columns.forEach((item, idx) => {
          // if (item.dataIndex == key) {
          //   columns[idx].filteredValue = filterVal;
          // } else

          if (lib.getType(item.children) == 'array') {
            item.children.forEach((child, childIdx) => {
              if (child.dataIndex == key) {
                columns[idx].children[childIdx].filteredValue = filterVal;
              }
            });
          }
        });
      }
    }),
    R.keys
  )(filters);
  return columns;
}

export function handleSort({ dataClone, field, order }) {
  return R.sort((a, b) => {
    if (order === 'descend') {
      return b[field] - a[field];
    }
    return a[field] - b[field];
  })(dataClone);
}

export const getPageData = ({ data, page, pageSize }) =>
  data.slice((page - 1) * pageSize, page * pageSize);

export const handleSrcData = data => {
  if (data.length === 0) {
    return data;
  }
  data.data = data.data.map((item, i) => [i + 1, ...item]);
  data.header = ['', ...data.header];
  if (data.rows) {
    data.data = data.data.map((item, key) => {
      let col = {
        key,
      };
      item.forEach((td, idx) => {
        col['col' + idx] = lib.parseNumber(td);
      });
      return col;
    });
  }
  return data;
};

// 根据 props 初始化state
export const initState = props => {
  let page = 1;
  let pageSize = props.pagesize || 15;
  let state = updateState(props, { page, pageSize });

  return {
    page,
    pageSize,
    filteredInfo: {},
    sortedInfo: {},
    ...state,
  };
};

// 表头合并处理
interface defaultData {
  merge?: string;
  mergesize?: string;
  mergetext?: string;
}
export const mergeConfig = (columns, config, dataSrc: defaultData = {}) => {
  // 如果使用外部接口，返回了配置信息则启用外部数据引入的配置
  let params = R.clone(config);

  params = Object.assign({}, params, R.pick(['merge', 'mergesize', 'mergetext'], dataSrc));

  if (R.isNil(params) || R.isNil(params.merge)) {
    return columns;
  }
  if (lib.getType(params.merge) == 'string') {
    params.merge = [params.merge];
  }
  if (lib.getType(params.mergetext) == 'string') {
    params.mergetext = [params.mergetext];
  } else if (typeof params.mergetext === 'undefined') {
    params.mergetext = [];
  }

  //  合并列宽
  params.mergesize = params.mergesize || '2';
  params.mergesize = Number(params.mergesize);

  params.merge = params.merge.map(item =>
    item
      .split('-')
      .map(cell => Number(cell))
      .sort((a, b) => a - b)
  );

  // 逆序排列
  params.merge.sort((a, b) => b[0] - a[0]);

  params.mergetext.reverse(); // 文字也需要逆序

  let mergeColumns = R.clone(columns);

  params.merge.forEach(([start, end], idx) => {
    // 将起始点合并
    end = end || start + params.mergesize - 1;

    // 如果合并列大于给定的总列数，停止合并
    if (end > columns.length) {
      return;
    }
    mergeColumns[start] = {
      title: params.mergetext[idx],
      children: R.slice(start, end + 1)(mergeColumns),
    };

    // 移除后续数据
    mergeColumns = R.remove(start + 1, end - start)(mergeColumns);
  });

  return mergeColumns;
};

// 根据 props 更新state //, columns
export const updateState = (props, { page, pageSize }, merge = true) => {
  let { dataSrc, loading } = props;

  const { source, time } = dataSrc;

  let dataSource = [];
  let handledData = R.clone(dataSrc.data);

  if (dataSrc.rows) {
    if (typeof handledData[0].key === 'undefined') {
      if (lib.getType(handledData[0]) === 'object') {
        handledData = R.map(R.props(dataSrc.header), handledData);
      }

      dataSrc.data = handledData.map((item, key) => {
        let col = {
          key,
        };
        item.forEach((td, idx) => {
          col['col' + idx] = td;
        });
        return col;
      });
    }

    dataSource = getPageData({
      data: dataSrc.data,
      page,
      pageSize,
    });
  }

  let borderedStr: string | null = window.localStorage.getItem('_tbl_bordered');
  let bordered: boolean = borderedStr === '0' ? false : true; // R.isNil(borderedStr) ||

  let state = {
    bordered,
    dataSource,
    total: dataSrc.rows,
    source,
    timing: time,
    dataSrc,
    loading,
    dataClone: dataSrc.data,
    dataSearchClone: [],
  };

  // console.log(props.config)
  let columns = handleColumns(
    {
      dataSrc,
      filteredInfo: {},
    },
    props.config && props.config.link || props.cartLinkPrefix || setting.searchUrl,
    props.config && props.config.host || setting.host,
    props.config && props.config.merge,
    !!props.simple
  );

  // 合并单元格展示
  if (merge) {
    columns = mergeConfig(columns, props.config, dataSrc);
  }

  return {
    ...state,
    columns,
  };
};
