/**
 * Recursively flatten the data
 * [{path:string},{path:string}] => {path,path2}
 * @param  menus
 */
const getFlatMenuKeys = menuData => {
  let keys = [];
  menuData.forEach(item => {
    if (item.children) {
      keys = keys.concat(getFlatMenuKeys(item.children));
    }
    keys.push(item.key);
  });
  return keys;
};

const getCurKey = breadcrumbList =>
  breadcrumbList.map(({ title }) => title).join('/');

const getFlatMenu = menuData => {
  let menus = [];
  menuData.forEach(item => {
    if (item.children) {
      menus = menus.concat(getFlatMenu(item.children));
    }
    menus.push(item);
  });
  return menus;
};

export { getFlatMenuKeys, getFlatMenu, getCurKey };
