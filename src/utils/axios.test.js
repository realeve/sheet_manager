import { axios, handleError, loadUserInfo, handleData } from './axios';

let readData = () =>
  axios({
    url: '3/e4e497e849',
  }).then(res => res.rows);

test('resolve', () =>
  axios({
    url: 'http://api.cbpc.ltd/3/e4e497e849',
  }).then(res => {
    expect(res.rows).toBeGreaterThan(0);
  }));

test('reject', () =>
  axios({
    url: 'http://api.cbpc.ltd/3/e4e497e849_err_token',
  }).catch(e => {
    expect(e.response.data).toMatchObject({ errmsg: 'invalid api id', status: 404 });
  }));

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
      data: {
        id: 3,
        nonce: 'e4e497e849',
      },
    }).then(res => res.rows)
  ).resolves.toBeGreaterThan(0);
});

test('401', () => {
  // expect.assertions(1);
  expect(
    axios({
      method: 'post',
      data: {
        id: 3,
        nonce: 'e4e497e8494',
      },
    })
  ).rejects.toMatchObject({ status: 404 });
});

test('错误处理', () => {
  let req = {
    config: {
      url: 'www.cdyc.cbpm',
    },
    response: {
      data: {
        msg: 401,
      },
      status: 401,
    },
  };
  expect(handleError(req)).rejects.toMatchObject(req);

  req = {
    config: {
      url: 'www.cdyc.cbpm',
    },
    response: {
      data: {
        msg: 403,
      },
      status: 403,
    },
  };
  expect(handleError(req)).rejects.toMatchObject(req);

  req = {
    config: {
      url: 'www.cdyc.cbpm',
    },
    response: {
      data: {
        msg: 404,
      },
      status: 404,
    },
  };
  expect(handleError(req)).rejects.toMatchObject(req);

  req = {
    config: {
      url: 'www.cdyc.cbpm',
    },
    response: {
      data: {
        msg: 500,
      },
      status: 500,
    },
  };
  expect(handleError(req)).rejects.toMatchObject(req);

  req = {
    config: {
      url: 'www.cdyc.cbpm',
    },
    response: {
      data: {
        msg: 206,
      },
      status: 206,
    },
  };
  expect(handleError(req)).rejects.toMatchObject(req);

  req = {
    request: '请求出错',
  };
  expect(handleError(req)).rejects.toMatchObject(req);

  req = {
    message: '内容出错',
  };
  expect(handleError(req)).rejects.toMatchObject(req);
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
