import React, { Component } from 'react';
import { Modal, Collapse } from 'antd';
import { Icon } from '@ant-design/compatible';
import icons from './iconListArr';
import styles from './iconList.less';

const R = require('ramda');
const Panel = Collapse.Panel;
interface IState {
  visible: boolean;
}
interface IProps extends IState {
  onCancel: (status: boolean) => void;
  onOk: (icon: string) => void;
}
const mapPropsToState = props => ({
  visible: props.visible,
});

class IconList extends Component<IProps, IState> {
  static defaultProps: Partial<IProps> = {
    visible: false,
  };

  constructor(props) {
    super(props);
    this.state = mapPropsToState(props);
  }

  static getDerivedStateFromProps(props, state) {
    if (R.equals(props.visible, state.visible)) {
      return null;
    }
    return mapPropsToState(props);
  }

  handleOk = () => {
    this.props.onCancel(false);
  };

  handleCancel = () => {
    this.props.onCancel(false);
  };

  selectIcon = (curIcon: string): void => {
    this.props.onOk(curIcon);
  };

  render() {
    // accordion
    interface IconItemsFun {
      (props: { list: Array<string> }): JSX.Element;
    }
    const IconItems: IconItemsFun = ({ list }) => {
      return (
        <ul className={styles.anticons}>
          {list.map(type => (
            <li key={type}>
              <Icon onClick={() => this.selectIcon(type)} type={type} style={{ fontSize: 36 }} />
            </li>
          ))}
        </ul>
      );
    };

    return (
      <Modal
        title="图标列表"
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        okText="确认"
        cancelText="取消"
      >
        <Collapse bordered={false} defaultActiveKey={['2', '3', '4', '5']}>
          {icons.map(({ type, list }, key) => (
            <Panel header={key + 1 + '. ' + type} key={String(key)}>
              <ul className={styles.anticons}>
                <IconItems list={list} />
              </ul>
            </Panel>
          ))}
        </Collapse>
      </Modal>
    );
  }
}

// IconList.defaultProps = {
//   visible: false
// };

export default IconList;
