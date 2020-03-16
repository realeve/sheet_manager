import { message } from 'antd';
import { Reducer } from 'redux';
import defaultSettings, { DefaultSettings } from '../../config/defaultSettings';
export interface SettingModelType {
  namespace: 'settings';
  state: DefaultSettings;
  reducers: {
    changeSetting: Reducer<DefaultSettings>;
  };
}
const settingKey = '_sheet_theme';
let lessNodesAppended;
const updateTheme = primaryColor => {
  // Don't compile less in production!
  // if (APP_TYPE !== 'site') {
  //   return;
  // }
  
  // Determine if the component is remounted
  if (!primaryColor) {
    return;
  }
  const hideMessage = message.loading('正在编译主题！', 0);
  function buildIt() {
    if (!window.less && !window.less.modifyVars) {
      message('less未加载.');
      return;
    }
    setTimeout(() => {
      window.less
        .modifyVars({
          '@primary-color': primaryColor,
        })
        .then(() => {
          hideMessage();
        })
        .catch(e => {
          console.error(e);
          message.error('Failed to update theme');
          hideMessage();
        });
    }, 200);
  }
  if (!lessNodesAppended) {
    // insert less.js and color.less
    const lessStyleNode = document.createElement('link');
    const lessConfigNode = document.createElement('script');
    const lessScriptNode = document.createElement('script');
    lessStyleNode.setAttribute('rel', 'stylesheet/less');
    lessStyleNode.setAttribute('href', '/color.less');
    lessConfigNode.innerHTML = `
      window.less = {
        async: true,
        env: 'production',
        javascriptEnabled: true
      };
    `;
    lessScriptNode.src = '/doc/less.min.js';
    lessScriptNode.async = true;
    lessScriptNode.onload = () => {
      buildIt();
      lessScriptNode.onload = null;
    };
    document.body.appendChild(lessStyleNode);
    document.body.appendChild(lessConfigNode);
    document.body.appendChild(lessScriptNode);
    lessNodesAppended = true;
  } else {
    buildIt();
  }
};

// const updateColorWeak = colorWeak => {
//   document.body.className = colorWeak ? 'colorWeak' : '';
// };

const updateColorWeak: (colorWeak: boolean) => void = colorWeak => {
  const root = document.getElementById('root');
  if (root) {
    root.className = colorWeak ? 'colorWeak' : '';
  }
};

const handleDarkTheme = theme => {
  let styleLink = document.getElementById('theme-style');
  let body = document.getElementsByTagName('body')[0];
  if (styleLink) {
    if (theme === 'realDark') {
      // 假如存在id为theme-style 的link标签，直接修改其href
      styleLink.href = '/theme/dark.css'; // 切换 ant design 组件主题
      body.className = 'body-wrap-dark'; // 切换自定义组件的主题
    } else {
      // 假如存在id为theme-style 的link标签，直接修改其href
      styleLink.href = ''; // 切换 ant design 组件主题
      body.className = ''; // 切换自定义组件的主题
    }
    return;
  }

  // 不存在的话，则新建一个
  styleLink = document.createElement('link');
  styleLink.type = 'text/css';
  styleLink.rel = 'stylesheet';
  styleLink.id = 'theme-style';

  if (theme === 'realDark') {
    // 假如存在id为theme-style 的link标签，直接修改其href
    styleLink.href = '/theme/dark.css'; // 切换 ant design 组件主题
    body.className = 'body-wrap-dark'; // 切换自定义组件的主题
  } else {
    // 假如存在id为theme-style 的link标签，直接修改其href
    styleLink.href = ''; // 切换 ant design 组件主题
    body.className = ''; // 切换自定义组件的主题
  }

  document.body.append(styleLink);
};

const SettingModel: SettingModelType = {
  namespace: 'setting',
  state: {},
  reducers: {
    getSetting(state) {
      const config = JSON.parse(window.localStorage.getItem(settingKey) || '{"collapse":true,"primaryColor":"#1da57a","navTheme":"dark"}');
      config.primaryColor = config.primaryColor || defaultSettings.primaryColor;
      Object.keys(state).forEach(key => {
        if (config[key]) {
          config[key] = config[key] === '1' ? true : config[key];
        }
      });
      const { primaryColor, colorWeak } = config;

      console.log(primaryColor)
      if (state.primaryColor !== primaryColor) {
        updateTheme(primaryColor);
      }

      // updateColorWeak(colorWeak);

      handleDarkTheme(config.navTheme);
      
      return {
        ...state,
        ...config,
      };
    },
    changeSetting(state, { payload }) {
      const { primaryColor, contentWidth } = payload;

      // console.log('主色', state.primaryColor, primaryColor);

      if (state.primaryColor !== primaryColor) {
        updateTheme(primaryColor);
      }
      // if (state.contentWidth !== contentWidth && window.dispatchEvent) {
      //   window.dispatchEvent(new Event('resize'));
      // }

      // updateColorWeak(colorWeak);
      window.localStorage.setItem(settingKey, JSON.stringify(payload));

      handleDarkTheme(payload.navTheme);
      console.log({ ...state, ...payload });
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default SettingModel;
