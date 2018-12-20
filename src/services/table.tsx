import * as lib from '../utils/lib';
import { uploadHost } from '../utils/axios';
import styles from '../components/Table.less';
import * as setting from '../utils/setting';
const R = require('ramda');

const isFilterColumn: <T>(
  data: Array<any>,
  key: T
) => { uniqColumn: Array<T>; filters: boolean } = (data, key) => {
  let isValid: boolean = true;

  const handleItem: (item: string | number | null) => void = (item) => {
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
    filters: isValid
  };
};

export function handleColumns(
  { dataSrc, filteredInfo },
  cartLinkPrefix = setting.searchUrl
) {
  let { data, header, rows } = dataSrc;
  let showURL: boolean = typeof data !== 'undefined' && rows > 0;
  if (!rows || rows === 0) {
    return [];
  }

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
      title
    };

    item.dataIndex = key;
    // item.key = key;

    let tdValue = data[0][key];
    if (lib.isNumOrFloat(tdValue)) {
      item.sorter = (a, b) => a[key] - b[key];
    }
    //  else {
    //   item.sorter = (a, b) => String(a[key]).localeCompare(b[key]);
    // }
    if (!showURL) {
      return item;
    }

    const isCart: boolean = lib.isCart(tdValue);
    if (lib.isReel(tdValue) || isCart) {
      item.render = (text) => {
        let url = cartLinkPrefix;
        const attrs = {
          href: url + text,
          target: '_blank'
        };
        return <a {...attrs}> {text} </a>;
      };
      return item;
    } else if (lib.isInt(tdValue) && !lib.isDateTime(tdValue)) {
      item.render = (text) => parseInt(text, 10).toLocaleString();
      return item;
    } else if (lib.hasDecimal(tdValue)) {
      item.render = (text) => parseFloat(text);
      return item;
    } else {
      item.render = (text) => {
        text = R.isNil(text) ? '' : text;
        let isImg =
          String(text).includes('image/') || String(text).includes('/file/');
        let isBase64Image =
          String(text).includes('data:image/') &&
          String(text).includes(';base64');
        let hostUrl = isBase64Image ? '' : uploadHost;
        return !isImg ? (
          text
        ) : (
          <img
            className={styles.imgContent}
            src={`${hostUrl}${text}`}
            alt={text}
          />
        );
      };
    }

    let fInfo = isFilterColumn(data, key);

    if (filteredInfo && fInfo.filters) {
      item.filters = fInfo.uniqColumn.map((text) => ({
        text,
        value: text
      }));
      item.onFilter = (value, record) => record[key].includes(value);
      item.filteredValue = filteredInfo[key] || null;
    }
    return item;
  });

  // 10列以上自动固定
  if (column.length > 10) {
    let fixedHeaders: Array<number> = [0, 1];
    fixedHeaders.forEach((id) => {
      if (column[id]) {
        column[id] = Object.assign(column[id], {
          width: 80,
          fixed: 'left'
        });
      }
    });
  }
  return column;
}

export function handleFilter({ data, filters }) {
  R.compose(
    R.forEach((key) => {
      if (filters[key] !== null && filters[key].length !== 0) {
        data = R.filter((item) => filters[key].includes(item[key]))(data);
      }
    }),
    R.keys
  )(filters);
  return data;
}

export function updateColumns({ columns, filters }) {
  R.compose(
    R.forEach((key) => {
      let idx = R.findIndex(R.propEq('dataIndex', key))(columns);
      columns[idx].filteredValue = filters[key];
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

export const handleSrcData = (data) => {
  if (data.length === 0) {
    return data;
  }
  data.data = data.data.map((item, i) => [i + 1, ...item]);
  data.header = ['', ...data.header];
  if (data.rows) {
    data.data = data.data.map((item, key) => {
      let col = {
        key
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
export const initState = (props) => {
  let page = 1;
  let pageSize = 15;
  let state = updateState(props, { page, pageSize });

  return {
    page,
    pageSize,
    filteredInfo: {},
    sortedInfo: {},
    ...state
  };
};

// 根据 props 更新state //, columns
export const updateState = (props, { page, pageSize }) => {
  let { dataSrc, loading } = props;

  const { source, time } = dataSrc;

  let dataSource = [];

  if (dataSrc.rows) {
    if (typeof dataSrc.data[0].key === 'undefined') {
      dataSrc.data = dataSrc.data.map((item, key) => {
        let col = {
          key
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
      pageSize
    });
  }

  let borderedStr: string | null = window.localStorage.getItem('_tbl_bordered');
  let bordered: boolean =
    R.isNil(borderedStr) || borderedStr === '0' ? false : true;

  let state = {
    bordered,
    dataSource,
    total: dataSrc.rows,
    source,
    timing: time,
    dataSrc,
    loading,
    dataClone: dataSrc.data,
    dataSearchClone: []
  };

  let columns = handleColumns(
    {
      dataSrc,
      filteredInfo: {}
    },
    props.cartLinkPrefix
  );

  return {
    ...state,
    columns
  };
};