import { julianToDate } from './julianConversion';

export default async function formatPlotData(content, startJD) {
  const lines = content.split('\n');
  const plotData = [{
    id: lines[0].split(',')[1],
    data: []
  }];

  let earliestTime = Number.POSITIVE_INFINITY;
  let latestTime = Number.NEGATIVE_INFINITY;

  const dayJS = await julianToDate(startJD, true /* use UTC */);
  const xAxisLegend = dayJS.format('YYYY-MM-DD HH:mm:ss');
  const yAxisLegend = lines[0].split(',')[1];

  lines.slice(1).forEach((line) => {
    if (line === '') return;
    const [ secondsStr, valueStr ] = line.split(',');
    const seconds = parseFloat(secondsStr);
    const value = parseFloat(valueStr);

    if (seconds < earliestTime) earliestTime = seconds;
    if (seconds > latestTime) latestTime = seconds;

    plotData[0].data.push({
      x: seconds,
      y: value,
    });
  });

  const timeRange = latestTime - earliestTime;
  return { plotData, xAxisLegend, yAxisLegend, timeRange };
}