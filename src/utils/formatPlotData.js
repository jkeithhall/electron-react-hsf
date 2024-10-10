import { julianToDate } from './julianConversion';

export default async function formatPlotData(content, startJD) {
  const lines = content.split('\n');
  const plotData = [{
    id: lines[0].split(',')[1],
    data: []
  }];

  const dayJS = await julianToDate(startJD);
  const xAxisLegend = dayJS.format('YYYY-MM-DD HH:mm:ss');
  const yAxisLegend = lines[0].split(',')[1];

  lines.slice(1).forEach((line) => {
    if (line === '') return;
    const [ seconds, value ] = line.split(',');

    plotData[0].data.push({
      x: dayJS.clone().add(parseFloat(seconds), 'seconds').format('YYYY-MM-DD HH:mm:ss'),
      y: parseFloat(value),
    });
  });

  return { plotData, xAxisLegend, yAxisLegend };
}