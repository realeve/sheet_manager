import { axios, handleError, handleUrl, loadUserInfo, handleData, mock, getType } from './axios';

let readData = () =>
  axios({
    url: 'http://api.cbpc.ltd/3/e4e497e849',
  }).then(res => res.rows);

test('handle url', () => {
  expect(handleUrl({ url: './test.json' })).toMatchObject({
    url: 'http://localhost:8000/test.json',
  });
});

test('resolve', () =>
  axios({
    url: 'http://api.cbpc.ltd/3/e4e497e849',
  }).then(res => {
    expect(res.rows).toBeGreaterThan(0);
  }));

test('reject', () => {
  axios({
    url: 'http://api.cbpc.ltd/3/e4e497e849_err_token',
  }).catch(e => {
    expect(e).toMatchObject({
      message: '请求错误',
      description: 'Request failed with status code 404',
      url: 'http://api.cbpc.ltd/3/e4e497e849_err_token',
      params: {},
    });
  });
});

test('服务端数据读写', () => {
  // expect.assertions(2);
  expect(readData()).resolves.toBeGreaterThan(0);

  window.localStorage.setItem(
    'user',
    '{"user":"develop","fullname":"管理员","token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NDM4NTI0NDcsIm5iZiI6MTU0Mzg1MjQ0NywiZXhwIjoxNTQzODU5NjQ3LCJ1cmwiOiJodHRwOlwvXC9sb2NhbGhvc3Q6OTBcL3B1YmxpY1wvbG9naW4uaHRtbCIsImV4dHJhIjp7InVpZCI6MSwiaXAiOiIwLjAuMC4wIn19.65tBJTAMZ-i2tkDDpu9DnVaroXera4h2QerH3x2fgTw"}'
  );

  expect(readData()).resolves.toBeGreaterThan(0);
});

test('post', () => {
  // expect.assertions(1);
  expect(
    axios({
      method: 'post',
      url: 'http://api.cbpc.ltd/',
      data: {
        id: 3,
        nonce: 'e4e497e849',
      },
    }).then(res => res.rows)
  ).resolves.toBeGreaterThan(0);
});

test('401', () => {
  axios({
    method: 'post',
    url: 'http://api.cbpc.ltd/',
    data: {
      id: 3,
      nonce: 'e4e497e84943',
    },
  }).catch(e => {
    expect(e).toMatchObject({ description: '请求错误', message: '请求错误', params: {}, url: '' });
  });
});

test('错误处理', () => {
  let req = {
    config: {
      url: 'http://127.0.0.1/_err_url',
    },
    response: {
      data: {
        msg: 401,
      },
      status: 401,
    },
  };
  // expect(handleError(req)).rejects.toMatchObject({
  //   description: '用户没有权限（令牌、用户名、密码错误）。401',
  //   message: '请求错误: http://127.0.0.1/_err_url?',
  //   params: {},
  //   status: 401,
  //   url: 'http://127.0.0.1/_err_url?',
  // });
  expect(handleError(req)).toBeUndefined();

  req = { description: '', message: '请求错误', params: {}, url: 'www.cdyc.cbpm' };
  expect(handleError(req)).rejects.toMatchObject({
    description: '请求错误',
    message: '请求错误',
    params: {},
    url: 'undefined?',
  });

  req = {
    request: '请求出错',
  };
  expect(handleError(req)).toBeUndefined();

  req = {
    message: '内容出错',
  };
  expect(handleError(req)).rejects.toMatchObject({
    description: '内容出错',
    message: '请求错误',
    params: {},
    url: 'undefined?',
  });
});

test('loadUserInfo', () => {
  expect(loadUserInfo(null)).toMatchObject({
    token:
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NDM4NTI0NDcsIm5iZiI6MTU0Mzg1MjQ0NywiZXhwIjoxNTQzODU5NjQ3LCJ1cmwiOiJodHRwOlwvXC9sb2NhbGhvc3Q6OTBcL3B1YmxpY1wvbG9naW4uaHRtbCIsImV4dHJhIjp7InVpZCI6MSwiaXAiOiIwLjAuMC4wIn19.65tBJTAMZ-i2tkDDpu9DnVaroXera4h2QerH3x2fgTw',
  });
  expect(loadUserInfo(JSON.stringify({ token: 'token' }))).toMatchObject({ token: 'token' });
});

test('handleData', () => {
  let data = { token: 'token', rows: 1 };
  expect(handleData({ data })).toMatchObject({ rows: 1 });
  expect(handleData({ data: { rows: 1 } })).toMatchObject({ rows: 1 });
});

// mock增加require后会报循环调用的错误，同时打包会存在问题，故取消，只允许传数据
// let requireData = await mock('./setting.ts');
// expect(requireData.host).toContain('http');

test('mock', () => {
  expect(mock({ rows: 2 })).resolves.toMatchObject({ rows: 2 });
});

test('gettype', () => {
  expect(getType({})).toBe('object');
});
