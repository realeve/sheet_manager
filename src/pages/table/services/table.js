import * as lib from "../../../utils/lib";
import { uploadHost, axios } from "../../../utils/axios";
import styles from "../components/Table.less";

const R = require("ramda");

export const fetchData = async ({ url, params }) =>
  await axios({ url, params });

const isFilterColumn = (data, key) => {
  let isValid = true;
  const handleItem = item => {
    if (R.isNil(item)) {
      isValid = false;
    }
    if (isValid) {
      item = item.trim();
      let isNum = lib.isNumOrFloat(item);
      let isTime = lib.isDateTime(item);
      if (isNum || isTime) {
        isValid = false;
      }
    }
  };
  let uniqColumn = R.compose(R.uniq, R.map(R.prop(key)))(data);
  R.map(handleItem)(uniqColumn);
  return {
    uniqColumn,
    filters: isValid
  };
};

export function handleColumns(
  { dataSrc, filteredInfo },
  cartLinkMode = "search"
) {
  let { data, header, rows } = dataSrc;
  let showURL = typeof data !== "undefined" && rows > 0;
  if (!rows || rows === 0) {
    return [];
  }

  let column = header.map((title, i) => {
    let key = "col" + i;
    let item = {
      title
    };

    item.dataIndex = key;
    // item.key = key;

    let tdValue = data[0][key];
    if (lib.isNumOrFloat(tdValue)) {
      item.sorter = (a, b) => {
        return a[key] - b[key];
      };
    }
    if (!showURL) {
      return item;
    }

    const isCart = lib.isCart(tdValue);
    if (lib.isReel(tdValue) || isCart) {
      item.render = text => {
        let url = lib.searchUrl;
        if (isCart && cartLinkMode !== "search") {
          url = lib.imgUrl;
        }
        const attrs = {
          href: url + text,
          target: "_blank"
        };
        return <a {...attrs}> {text} </a>;
      };
      return item;
    } else if (lib.isInt(tdValue) && !lib.isDateTime(tdValue)) {
      item.render = text => parseInt(text, 10).toLocaleString();
      return item;
    } else {
      item.render = text => {
        text = R.isNil(text) ? "" : text;
        let isImg =
          String(text).includes("image/") || String(text).includes("/file/");
        return !isImg ? (
          text
        ) : (
          <img
            className={styles.imgContent}
            src={`${uploadHost}${text}`}
            alt={text}
          />
        );
      };
    }

    let fInfo = isFilterColumn(data, key);

    if (filteredInfo && fInfo.filters) {
      item.filters = fInfo.uniqColumn.map(text => ({
        text,
        value: text
      }));
      item.onFilter = (value, record) => record[key].includes(value);
      item.filteredValue = filteredInfo[key] || null;
    }
    return item;
  });

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
      let idx = R.findIndex(R.propEq("dataIndex", key))(columns);
      columns[idx].filteredValue = filters[key];
    }),
    R.keys
  )(filters);
  return columns;
}

export function handleSort({ dataClone, field, order }) {
  return R.sort((a, b) => {
    if (order === "descend") {
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
  data.header = ["", ...data.header];
  if (data.rows) {
    data.data = data.data.map((item, key) => {
      let col = {
        key
      };
      item.forEach((td, idx) => {
        col["col" + idx] = td;
      });
      return col;
    });
  }
  return data;
};

export const handleParams = ({ tid, params, dateRange }) => {
  const [tstart, tend] = dateRange;
  let param = {
    tstart,
    tend,
    tstart2: tstart,
    tend2: tend,
    tstart3: tstart,
    tend3: tend
  };
  let option = tid.map(url => ({
    url: url + "/array",
    params: param
  }));
  let paramKeys = Object.keys(params);

  // 对传入参数补齐
  paramKeys.forEach(key => {
    let val = params[key];
    if (R.is(String, val)) {
      val = [val];
    }
    let lastVal = R.last(val);
    // 对后几个元素填充数据
    for (let i = val.length; i < option.length; i++) {
      val[i] = lastVal;
    }
    params[key] = val;
  });

  return option.map((item, idx) => {
    paramKeys.forEach(key => {
      item.params[key] = params[key][idx];
    });
    return JSON.parse(JSON.stringify(item));
  });
};
