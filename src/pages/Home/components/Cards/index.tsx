import { ReactNode } from 'react';

export const chartHeight = 300;

export const cardStyle = ({
  title = '',
  height = 300,
}: {
  height?: number;
  title: string | ReactNode;
}) => ({
  title,
  bodyStyle: { height: height, padding: '0 15px 0 10px' },
  headStyle: { borderBottom: 'none' },
});

export const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: 24 },
};
