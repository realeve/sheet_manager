export interface IChart {
  key: string;
  title: string;
  default?: string;
  url?: string | Array<string>;
}

export type TChartConfig: Array<interface.IChart>