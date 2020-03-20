import React from 'react';
import useFetch from '@/components/hooks/useFetch';
import SimpleList from '../../SimpleList';
import { Scrollbars } from 'react-custom-scrollbars';

export default ({ cart }) => {
  let { data, error } = useFetch({
    param: {
      url: '/886/575bf04a51.json',
      params: {
        cart,
      },
    },
    valid: () => cart && cart.length > 0,
  });
  return (
    <Scrollbars
      autoHide
      autoHeight
      autoHeightMin={300}
      autoHeightMax={600}
      style={{
        marginBottom: 10,
        width: '100%',
      }}
    >
      {data && <SimpleList removeEmpty data={{ ...data, err: error }} />}
    </Scrollbars>
  );
};
