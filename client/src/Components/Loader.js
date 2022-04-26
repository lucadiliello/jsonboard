import { Space, Spin } from "antd";
import React from "react";
 
const Loader = () => {
    return <Space align="center" direction="vertical" size="middle" style={{ display: 'flex'}}><Spin /></Space>
};

export default Loader;
