import React from 'react';
import UnLogin from './unlogin';
import { redirectLogin } from './unlogin';
import { mount } from 'enzyme';
// import sinon from 'sinon';
test('unlogin', () => {
  // const onButtonClick = sinon.spy();
  const wrapper = mount(<UnLogin />);
  expect(wrapper.find('Exception').length).toBe(1);
  expect(wrapper.find('Exception').prop('type')).toBe('403');

  // render button
  expect(wrapper.find('Button').prop('type')).toBe('primary');
  // wrapper.find('Button').simulate('click');
  // expect(onButtonClick).to.have.property('callCount', 1);
});

test('redirectLogin', () => {
  expect(redirectLogin({ href: '/home', origin: 'http://localhost' })).toBeUndefined();
});
