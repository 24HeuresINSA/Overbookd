export type Dataset = {
  label: string;
  data: number[];
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  pointRadius: number;
  pointHitRadius: number;
  yAxisID?: string;
};

export type ChartData = {
  labels: string[];
  datasets: Dataset[];
};

export type Tooltip = {
  datasetIndex: number;
  yLabel: number;
  index: number;
};

export function tooltipLabel(tooltipItem: Tooltip, data: ChartData): string {
  const datasetLabel = data.datasets[tooltipItem.datasetIndex].label || "";
  const dataPoint = tooltipItem.yLabel;
  return `${datasetLabel}: ${dataPoint}`;
}
