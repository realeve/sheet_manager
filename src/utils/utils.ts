const themeConfig = {
  daybreak: 'daybreak',
  '#1da57a': 'daybreak',
  '#F5222D': 'dust',
  '#FA541C': 'volcano',
  '#FAAD14': 'sunset',
  '#13C2C2': 'cyan',
  '#1da57a': 'green',
  '#2F54EB': 'geekblue',
  '#722ED1': 'purple',
};

const invertKeyValues = (obj: Object) =>
  Object.keys(obj).reduce((acc, key) => {
    acc[obj[key]] = key;
    return acc;
  }, {});

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);
const isNode =
  typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

export const isBrowser = () =>
  typeof window !== 'undefined' && typeof window.document !== 'undefined' && !isNode;

export function guid() {
  return 'xxxxxxxx'.replace(/[xy]/g, c => {
    // eslint-disable-next-line no-bitwise
    const r = (Math.random() * 16) | 0;
    // eslint-disable-next-line no-bitwise
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * #1da57a -> daybreak
 * @param val
 */
export function genThemeToString(val?: string): string {
  return val && themeConfig[val] ? themeConfig[val] : val;
}

/**
 * daybreak-> #1da57a
 * @param val
 */
export function genStringToTheme(val?: string): string {
  const stringConfig = invertKeyValues(themeConfig);
  return val && stringConfig[val] ? stringConfig[val] : val;
}
