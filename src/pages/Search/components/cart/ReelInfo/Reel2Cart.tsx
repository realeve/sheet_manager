import React from 'react';
import useFetch from '@/components/hooks/useFetch';
import SimpleList from '../../SimpleList';

export default ({ reel }) => {
  let { data, error } = useFetch({
    param: {
      url: '/887/f4b579878d.json',
      params: {
        reel,
      },
    },
    valid: () => reel && reel.length > 0,
  });
  return data && <SimpleList span={6} removeEmpty removeZero data={{ ...data, err: error }} />;
};
