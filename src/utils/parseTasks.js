import { randomId } from '@mui/x-data-grid-generator';

const flattenTasks = (taskList) => {
  const flattenedTasks = taskList.map(task => {
    const { target, ...rest } = task;
    const { name, type, value, dynamicState } = target;
    const { integratorType, stateData, eoms } = dynamicState;
    const [latitude, longitude, altitude] = stateData;
    return {
      id: randomId(),
      ...rest,
      targetName: name,
      targetType: type,
      targetValue: value,
      dynamicStateType: dynamicState.type,
      integratorType,
      latitude,
      longitude,
      altitude,
      eomsType: eoms.type,
    };
  });
  return flattenedTasks;
}

const reformatTasks = (taskList) => {
  return taskList.map(task => {
    const { name, type, maxTimes, targetName, targetType, targetValue, dynamicStateType, integratorType, latitude, longitude, altitude, eomsType } = task;
    return {
      name,
      type,
      maxTimes,
      target: {
        name: targetName,
        type: targetType,
        value: targetValue,
        dynamicState: {
          type: dynamicStateType,
          integratorType,
          stateData: [latitude, longitude, altitude],
          eoms: {
            type: eomsType,
          },
        },
      },
    };
  });
}

export { flattenTasks, reformatTasks };