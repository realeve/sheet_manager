import { axios } from './axios';

let readData = () =>
  axios({
    url: '3/e4e497e849'
  });

test('服务端数据读写', async () => {
  let res = await readData();
  expect(res.rows).toBeGreaterThan(0);

  window.localStorage.setItem(
    'user',
    '{"user":"develop","fullname":"管理员","token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NDM4NTI0NDcsIm5iZiI6MTU0Mzg1MjQ0NywiZXhwIjoxNTQzODU5NjQ3LCJ1cmwiOiJodHRwOlwvXC9sb2NhbGhvc3Q6OTBcL3B1YmxpY1wvbG9naW4uaHRtbCIsImV4dHJhIjp7InVpZCI6MSwiaXAiOiIwLjAuMC4wIn19.65tBJTAMZ-i2tkDDpu9DnVaroXera4h2QerH3x2fgTw"}'
  );
  res = await readData();
  expect(res.rows).toBeGreaterThan(0);
});

test('post', async () => {
  let res = await axios({
    method: 'post',
    data: {
      id: 3,
      nonce: 'e4e497e849'
    }
  });
  expect(res.rows).toBeGreaterThan(0);
});

test('401', async () => {
  expect(
    axios({
      method: 'post',
      data: {
        id: 3,
        nonce: 'e4e497e8494'
      }
    })
  ).rejects.toMatchObject({ status: 404 });
});