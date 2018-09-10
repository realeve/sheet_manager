import React from "react";
import { connect } from "dva";
import Chart from "./components/Chart";
import { DatePicker, Card } from "antd";
import styles from "./index.less";
import dateRanges from "../../utils/ranges";
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");

const RangePicker = DatePicker.RangePicker;

function Charts({ dispatch, dateRange, config, loading }) {
  const onDateChange = async (dates, dateStrings) => {
    const [tstart, tend] = dateStrings;
    await dispatch({
      type: "chart/setStore",
      payload: { dateRange: dateStrings }
    });

    await dispatch({
      type: "chart/updateConfig",
      payload: { tstart, tend }
    });
  };

  const DateRangePicker = () => (
    <div>
      {/* <label className={styles.labelDesc}>起始时间:</label> */}
      <RangePicker
        ranges={dateRanges}
        format="YYYYMMDD"
        onChange={onDateChange}
        defaultValue={[moment(dateRange[0]), moment(dateRange[1])]}
        locale={{
          rangePlaceholder: ["开始日期", "结束日期"]
        }}
      />
    </div>
  );
  if (!config.length) {
    return <Card title="加载中" loading={true} />;
  }
  return (
    <>
      <div className={styles.header}>
        <div className={styles.dateRange}>
          <DateRangePicker />
        </div>
      </div>
      {config.map((item, id) => (
        <div
          className={id > 0 ? styles.tableContainer : ""}
          key={item.params.ID}
        >
          <Chart config={item} idx={id} />
        </div>
      ))}
    </>
  );
}

function mapStateToProps(state) {
  return {
    ...state.chart
  };
}

export default connect(mapStateToProps)(Charts);
