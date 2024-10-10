export const lineChartProps = {
  margin: { top: 30, right: 20, bottom: 50, left: 70 },
  curve: "linear",
  xScale: {
    type: 'time',
    format: '%Y-%m-%d %H:%M:%S',
    precision: 'second',
    useUTC: false,
  },
  yScale: {
    type: 'linear',
    min: 'auto',
    max: 'auto',
  },
  xFormat: "time:%H:%M:%S",
  yFormat: " >-.4~f",
  colors: { scheme: 'set2' },
  pointSize: 10,
  pointColor: { theme: 'background' },
  pointBorderWidth: 3,
  pointBorderColor: { from: 'serieColor' },
  pointLabel: "data.yFormatted",
  pointLabelYOffset: -20,
  enableTouchCrosshair: false,
  useMesh: true
};