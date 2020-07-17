const R = require('ramda');
let mapStateToProps = props =>
  props.map(({ icon, title: name, url: path, children, pinyin, pinyin_full }) => {
    let obj = {
      icon,
      name,
      path,
      exact: true,
      pinyin,
      pinyin_full,
    };
    if (children) {
      obj.children = mapStateToProps(children);
    }
    return obj;
  });

const getMenuData = props => {
  if (typeof props === 'string') {
    props = JSON.parse(props);
  }
  let data = mapStateToProps(props);
  let menuData = handleMenuData(data);

  // 默认以item.path作为唯一key，可能出现path重复的情况(如pth不存在的子菜单)，需要单独处理
  let handleKey = item => {
    item.key = item.bread.map(({ title }) => title).join('/');
    if (item.children) {
      item.children = item.children.map(a => handleKey(a));
    }
    return item;
  };
  return menuData.map(item => handleKey(item));
};

const handleMenuData = menuData => {
  let menuList = R.clone(menuData);
  let handleItem = (item, bread = [{ title: '主页', href: '/' }]) => {
    item.bread = [...bread, { title: item.name, href: item.path }];
    if (item.children) {
      item.children = item.children.map(a => handleItem(a, item.bread));
    }
    return item;
  };
  return menuList.map(item => handleItem(item));
};

// 根据Url获取对应菜单层级关系
const handleBreadItem = (pathname, menuData) => {
  let result = [];
  menuData.forEach(({ path, children, bread }) => {
    let _path = decodeURI(path).trim(),
      _path2 = pathname.trim();
    if (_path[0] == '/') {
      _path = _path.slice(1);
    }
    if (_path2[0] == '/') {
      _path2 = _path2.slice(1);
    }
    if (R.equals(_path, _path2)) {
      result = bread;
      return;
    }
    if (result.length === 0 && children) {
      result = handleBreadItem(pathname, children);
    }
  });
  return result;
};

export default {
  getMenuData,
  getBreadcrumbList: handleBreadItem,
};
