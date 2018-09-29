import React from "react";
import Link from "umi/link";
import Exception from "ant-design-pro/lib/Exception";

export default () => (
  <Exception
    type="404"
    style={{ minHeight: 500, height: "100%" }}
    linkElement={Link}
  />
);
