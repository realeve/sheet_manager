import lib from './gColor';

test('全局色彩处理', () => {
  expect(
    lib.handleColor({
      title: 'nothing',
    })
  ).toMatchObject({
    title: 'nothing',
  });

  expect(
    lib.handleColor({
      series: [
        {
          name: 'nothing',
        },
      ],
    })
  ).toMatchObject({
    series: [
      {
        name: 'nothing',
      },
    ],
  });

  expect(
    lib.handleColor({
      series: [
        {
          name: '9602A',
        },
      ],
    })
  ).toMatchObject({ color: ['#7ECF51'], series: [{ name: '9602A' }] });
});
