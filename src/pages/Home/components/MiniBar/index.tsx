import { Chart, Geom, Tooltip, Axis } from 'bizcharts';

import React from 'react';
import autoHeight from '../autoHeight';
import styles from '../index.less';

export interface MiniBarProps {
  color?: string;
  height?: number;
  data: {
    x: number | string;
    y: number;
  }[];
  showX?: boolean;
  showY?: boolean;
  forceFit?: boolean;
  style?: React.CSSProperties;
}

const MiniBar: React.FC<MiniBarProps> = props => {
  const {
    height = 0,
    forceFit = true,
    color = '#1890FF',
    showX = false,
    showY = false,
    data = [],
  } = props;

  const scale = {
    x: {
      type: 'cat',
    },
    y: {
      min: 0,
    },
  };

  const padding: [number, number, number, number] = [36, 5, 30, 5];

  const tooltip: [string, (...args: any[]) => { name?: string; value: string }] = [
    'x*y',
    (x: string, y: string) => ({
      name: x,
      value: y,
    }),
  ];

  // for tooltip not to be hide
  const chartHeight = height + 54;

  return (
    <div className={styles.miniChart} style={{ height }}>
      <div className={styles.chartContent}>
        <Chart scale={scale} height={chartHeight} forceFit={forceFit} data={data} padding={padding}>
          <Tooltip showTitle={false} crosshairs={true} />
          <Axis
            name="x"
            visible={showX}
            grid={false}
            subTickLine={false}
            tickLine={false}
            line={false}
          />
          <Axis name="y" visible={showY} grid={false} />
          <Geom type="interval" position="x*y" color={color} tooltip={tooltip} />
        </Chart>
      </div>
    </div>
  );
};
export default autoHeight()(MiniBar);
