import { randomId } from '@mui/x-data-grid-generator';

const initTaskList = [{
  id: randomId(),
  taskName: 't6',
  type: 'gt',
  latitude: 37.7749,
  longitude: -122.4194,
  altitude: 0.0,
  priority: 2,
  value: 4,
  minQuality: 5.0,
  desiredCapTime: 28800,
  nonzeroValCapTime: 28800,
}, {
  id: randomId(),
  taskName: 't7',
  type: 'gt',
  latitude: 47.6061,
  longitude: -122.3328,
  altitude: 0.0,
  priority: 2,
  value: 4,
  minQuality: 5.0,
  desiredCapTime: 28800,
  nonzeroValCapTime: 28800,
}, {
  id: randomId(),
  taskName: 't8',
  type: 'gt',
  latitude: 34.4208,
  longitude: -119.6982,
  altitude: 0.0,
  priority: 2,
  value: 4,
  minQuality: 5.0,
  desiredCapTime: 28800,
  nonzeroValCapTime: 28800,
}];

export default initTaskList;