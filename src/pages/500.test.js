import React from 'react';
import Exception from './500';
import { shallow } from 'enzyme';

test('Exception500', () => {
  const wrapper = shallow(<Exception />).find('Exception');
  expect(wrapper.length).toBe(1);
  expect(wrapper.prop('type')).toBe('500');
});
