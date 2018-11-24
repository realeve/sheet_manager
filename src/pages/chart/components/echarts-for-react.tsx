import echarts from 'echarts';
import EchartsReactCore from './core';
import 'echarts-gl';

// export the Component the echarts Object.
export default class EchartsReact extends EchartsReactCore {
  echartsLib = null;
  constructor(props) {
    super(props);
    this.echartsLib = echarts;
  }
}
