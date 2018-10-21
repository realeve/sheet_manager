import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input, Modal } from 'antd';
import classNames from 'classnames';
import styles from './index.less';
import config from '@/pages/chart/utils/chartConfig';
export default class ChartLink extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    visible: PropTypes.bool,
    onToggle: PropTypes.func
  };

  static defaultProps = {
    className: '',
    visible: false,
    onToggle: () => {}
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible
    };
  }

  static getDerivedStateFromProps({ visible }, state) {
    if (visible !== state.visible) {
      return {
        visible
      };
    }
    return null;
  }

  handleOk = () => {
    this.props.onToggle();
  };

  handleCancel = () => {
    this.props.onToggle();
  };

  render() {
    const { visible } = this.state;

    return (
      <Modal
        title="图表链接生成"
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}>
        {config[0].type}
      </Modal>
    );
  }
}
