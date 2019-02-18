import React from 'react';
import UnLogin from './unlogin';
import { redirectLogin } from './unlogin';
import { mount } from 'enzyme';
import sinon from 'sinon';
test('unlogin', async () => {
  const onButtonClick = sinon.spy();
  const wrapper = mount(<UnLogin />);
  expect(wrapper.find('Exception').length).toBe(1);
  expect(wrapper.find('Exception').prop('type')).toBe('403');

  // render button
  const Button = wrapper.find('Button').last();
  expect(Button.prop('type')).toBe('primary');
  Button.simulate('click');
  expect(onButtonClick).toHaveProperty('callCount', 0);
});

test('redirectLogin', () => {
  expect(redirectLogin({ href: '/home', origin: 'http://localhost' })).toBeUndefined();
});
