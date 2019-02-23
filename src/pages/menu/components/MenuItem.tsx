import React, { Component } from 'react';
import { Modal, Button, Input, Tag, Icon } from 'antd';
import styles from './menuitem.less';
import IconList from './IconList';
import util from '@/utils/pinyin';
const R = require('ramda');

export interface TMenuItem {
  id: string | number;
  icon: string;
  title: string;
  url: string;
  pinyin?: string;
  pinyin_full?: string;
  uid?: string | number;
  detail: any;
  [key: string]: any;
}

interface IState {
  visible: boolean;
  menuItem: TMenuItem;
  editMode: boolean;
  iconVisible?: boolean;
}
interface IProps extends IState {
  onChange?: (state: TMenuItem) => void;
  onCancel?: (status: boolean) => void;
}

const mapPropsToState: (IProps) => IState = props => ({
  visible: props.visible,
  menuItem: props.menuItem,
  editMode: props.editMode,
});

class MenuItem extends Component<IProps, IState> {
  static defaultProps: Partial<IProps> = {
    visible: false,
    menuItem: {
      id: 0,
      title: '',
      url: '',
      icon: '',
      detail: '',
    },
    editMode: false,
    iconVisible: false,
  };

  constructor(props) {
    super(props);
    this.state = mapPropsToState(props);
  }

  static getDerivedStateFromProps(props, state) {
    if (
      // R.equals(props.visible, state.visible) ||
      // (props.editMode && R.isNil(props.menuItem))
      R.equals(props, state)
    ) {
      return null;
    }
    return mapPropsToState(props);
  }

  handleOk = () => {
    this.props.onChange(this.state.menuItem);
    this.props.onCancel(false);
  };

  handleCancel = () => {
    this.props.onCancel(false);
  };

  toggleIconList = (iconVisible: boolean) => {
    this.setState({
      iconVisible,
    });
  };

  chooseIcon = () => {
    this.toggleIconList(true);
  };

  updateIcon = (icon: string) => {
    let { menuItem }: { menuItem: TMenuItem } = this.state;
    menuItem = Object.assign(menuItem, { icon });
    this.setState({ menuItem });
    this.toggleIconList(false);
  };

  addLink = (link: string) => {
    let { menuItem } = this.state;
    menuItem = Object.assign(menuItem, { url: `/${link}#id=` });
    this.setState({ menuItem });
  };

  updateState: (key: string, e: React.ChangeEvent<HTMLInputElement>) => void = (key, e) => {
    let { menuItem }: { menuItem: TMenuItem } = this.state;
    let { value } = e.target;
    let pinyinDetail = {};
    if (key === 'title') {
      pinyinDetail = {
        pinyin: util.toPinYin(value).toLowerCase(),
        pinyin_full: util.toPinYinFull(value).toLowerCase(),
      };
    }

    menuItem = Object.assign(menuItem, {
      [key]: value,
      ...pinyinDetail,
    });
    this.setState({ menuItem });
  };

  render() {
    let { menuItem, editMode, iconVisible } = this.state;
    let urlIcon = menuItem.icon === '' ? '图标' : <Icon type={menuItem.icon} />;
    return (
      <Modal
        title={editMode ? '编辑菜单项' : '新增菜单项'}
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        okText="确认"
        cancelText="取消"
      >
        <IconList visible={iconVisible} onCancel={this.toggleIconList} onOk={this.updateIcon} />
        <div className={styles.title}>
          <Button onClick={this.chooseIcon}>{urlIcon}</Button>
          <Input
            placeholder="标题"
            value={menuItem.title}
            onChange={e => this.updateState('title', e)}
          />
        </div>
        <Input
          className={styles.input}
          placeholder="链接地址"
          value={menuItem.url}
          onChange={e => this.updateState('url', e)}
        />
        <div className={styles.tags}>
          <Tag color="#f50" onClick={() => this.addLink('chart')}>
            图表
          </Tag>
          <Tag color="#108ee9" onClick={() => this.addLink('table')}>
            报表
          </Tag>
        </div>
      </Modal>
    );
  }
}

export default MenuItem;
