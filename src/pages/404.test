import React from 'react';
import Exception from './404';
import { shallow } from 'enzyme';

test('Exception404', () => {
  const wrapper = shallow(<Exception />).find('Exception');
  expect(wrapper.length).toBe(1);
  expect(wrapper.prop('type')).toBe('404');
});
