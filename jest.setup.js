import Adapter from 'enzyme-adapter-react-16';
import { configure } from 'enzyme';

configure({
  adapter: new Adapter(),
});

// For async tests, catch all errors here so we don't have to try / catch
// everywhere for safety

// process.on('unhandledRejection', error => {
//   console.log('enzyme错误：', error);
// });

// jest 24.x.x 版本会丢失 console
if (!console || console.log) {
  console.log = jest.fn(input => {
    process.stdout.write(`${input} \n`);
  });
  console.warn = console.log;
  console.error = console.log;
}
