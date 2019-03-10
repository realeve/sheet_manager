import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';

export default class ChartLink extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    visible: PropTypes.bool,
    onToggle: PropTypes.func,
    panelComponent: PropTypes.any,
  };

  static defaultProps = {
    className: '',
    visible: false,
    onToggle: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
    };
  }

  static getDerivedStateFromProps({ visible }, state) {
    if (visible !== state.visible) {
      return {
        visible,
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
        title="图表配置说明"
        visible={visible}
        width="800px"
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        {this.props.panelComponent}
      </Modal>
    );
  }
}
