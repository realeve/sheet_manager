import moment from "moment";

export default {
  去年: [
    moment()
    .subtract(1, "year")
    .startOf("year"),
    moment()
    .subtract(1, "year")
    .endOf("year")
  ],
  今年: [moment().startOf("year"), moment().endOf("year")],
  上半年: [
    moment()
    .quarter(1)
    .startOf("quarters"),
    moment()
    .quarter(2)
    .endOf("quarters")
  ],
  下半年: [
    moment()
    .quarter(3)
    .startOf("quarters"),
    moment()
    .quarter(4)
    .endOf("quarters")
  ],
  上季: [
    moment()
    .subtract(1, "quarter")
    .startOf("quarter"),
    moment()
    .subtract(1, "quarter")
    .endOf("quarter")
  ],
  本季: [moment().startOf("quarter"), moment().endOf("quarter")],
  去年同期: [
    moment()
    .subtract(1, "year")
    .startOf("month"),
    moment()
    .subtract(1, "year")
    .endOf("month")
  ],
  "过去一月": [moment().subtract(1, "month"), moment()],
  本月: [moment().startOf("month"), moment().endOf("month")],
  "7天前": [moment().subtract(1, "week"), moment()],
  上周: [
    moment()
    .subtract(1, "week")
    .startOf("week"),
    moment()
    .subtract(1, "week")
    .endOf("week")
  ],
  本周: [moment().startOf("week"), moment().endOf("week")],
  昨天: [moment().subtract(1, "days"), moment().subtract(1, "days")],
  今天: [moment(), moment()]
};
