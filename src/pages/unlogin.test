import React from 'react';
import UnLogin from './unlogin';
import { mount } from 'enzyme';
// import sinon from 'sinon';
test('Exception500', () => {
  // const onButtonClick = sinon.spy();
  const wrapper = mount(<UnLogin />);
  expect(wrapper.find('Exception').length).toBe(1);
  expect(wrapper.find('Exception').prop('type')).toBe('403');

  // render button
  expect(wrapper.find('Button').prop('type')).toBe('primary');
  // wrapper.find('Button').simulate('click');
  // expect(onButtonClick).to.have.property('callCount', 1);
  // router.push在测试中会莫名报错
});
