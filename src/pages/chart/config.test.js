import React from 'react';
import Config from './Config';
import { mount } from 'enzyme';
// import sinon from 'sinon';
import chartConfig from './utils/chartConfig';

import ConfigItem from './components/ConfigItem';

test('初始状态', () => {
  // sinon.spy(Config.prototype, 'onSelect');
  const wrapper = mount(<Config />);
  let state = wrapper.state();
  expect(state.chartType).toBe(0);
  expect(state.config).toEqual(chartConfig[0]);

  // 默认链接设置值
  expect(wrapper.find('.charttype').text()).toContain('type=bar');
  expect(
    wrapper
      .find('Select')
      .last()
      .text()
  ).toContain('柱状图');

  expect(wrapper.find('.container li').length).toBeGreaterThan(10);

  // 弹出select
  wrapper
    .find('Select')
    .last()
    .simulate('click');

  // 选择项
  wrapper
    .find('Select')
    .last()
    .find('li')
    .at(2)
    .simulate('click');
  expect(wrapper.state().chartType).toBe(2);
  expect(wrapper.find('.charttype').text()).toContain('type=scatter');
});

test('ConfigItem组件测试', () => {
  // 未渲染 type 项
  expect(
    mount(<ConfigItem idx={0} config={{ key: 'a', title: 'title', default: 0, url: 'url' }} />)
      .find('div')
      .first()
      .text()
  ).not.toContain('type:');

  // 渲染 type 项
  expect(
    mount(<ConfigItem idx={0} config={{ key: 'a', title: 'title', default: 0, url: 'url',type:'bar' }} />)
      .find('div')
      .first()
      .text()
  ).toContain('type:bar');
});
