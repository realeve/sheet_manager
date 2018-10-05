import React from "react";
import { Spin } from "antd";
// loading components from code split
// https://umijs.org/plugin/umi-plugin-react.html#dynamicimport
export default () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      width: "100%"
    }}
  >
    <Spin size="large" />
  </div>
);
