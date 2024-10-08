import { randomId } from '@mui/x-data-grid-generator';
import { julianToDate } from './julianConversion';

export default function formatTimeline(scheduleContent, startJD) {
  let scheduleValue;
  let startTime = julianToDate(startJD).toISOString();
  let maxEndTime = 0;
  let items = [];
  let groups = [];

  const lines = scheduleContent.split("\n").filter((line) => line !== "");

  lines.forEach((line, index) => {
    if (index === 0) {
      scheduleValue = line.split("Schedule Value: ")[1];
    } else {
      const cleanTokens = splitEventEndFromName(line);

      if (index === 1) groups = groups.concat(getGroups(cleanTokens));

      const { items: currItems, maxEndTime: currMaxEndTime } = getItems(cleanTokens, startJD, maxEndTime);
      maxEndTime = currMaxEndTime;
      items = items.concat(currItems);
    }
  });

  const endTime = julianToDate(startJD).add(maxEndTime, 'seconds').toISOString();
  return { scheduleValue, startTime, endTime, items, groups };
}

function separateNumeralName(token) {
  let numeral = '';
  while (token[0] >= '0' && token[0] <= '9') {
    numeral += token[0];
    token = token.slice(1);
  }

  return { numeral, cleanName: token };
}

const splitEventEndFromName = (line) => {
  const tokens = line.split("\t");
  const cleanTokens = [];
  tokens.forEach((token, index) => {
    if (index % 9 === 0 && index < tokens.length - 1) {
      const { numeral, cleanName } = separateNumeralName(token);
      cleanTokens.push(numeral);
      cleanTokens.push(cleanName);
    } else {
      cleanTokens.push(token);
    }
  });

  return cleanTokens.slice(1);
}

function getGroups(tokens) {
  const groups = [];
  tokens.forEach((token, index) => {
    const name = token.split(":")[0];
    if (index % 10 === 0) groups.push({ id: index / 10, content: name });
  });

  return groups;
}

function getItems(tokens, startJD, maxEndTime) {
  const date = julianToDate(startJD); // Date object
  const items = [];

  const currEvent = {
    id: '',
    content: '',
    start: '',
    end: '',
    type: 'background',
    group: 0,
  };
  const currTask = {
    id: '',
    content: '',
    start: '',
    end: '',
    group: 0,
  };

  tokens.forEach((token, index) => {
    switch (index % 10) {
      case 1: // Event/Task Name
        currEvent.id = randomId();
        currTask.id = randomId();
        currEvent.group = Math.floor(index / 10);
        currTask.group = Math.floor(index / 10);
        currEvent.content = `${token} Event`;
        currTask.content = `${token} Task`;
        break;
      case 3: // Task Start
        const taskStart = parseInt(token);
        currTask.start = date.add(taskStart, 'seconds').toISOString();
        break;
      case 5: // Event Start
        const eventStart = parseInt(token);
        currEvent.start = date.add(eventStart, 'seconds').toISOString();
        break;
      case 7: // Task End
        const taskEnd = parseInt(token);
        if (taskEnd > maxEndTime) maxEndTime = taskEnd;

        currTask.end = date.add(taskEnd, 'seconds').toISOString();
        items.push({ ...currTask });
        break;
      case 9: // Event End
        const eventEnd = parseInt(token);
        if (eventEnd > maxEndTime) maxEndTime = eventEnd;

        currEvent.end = date.add(eventEnd, 'seconds').toISOString();
        items.push({ ...currEvent });
        break;
      default:
        break;
    }
  });

  return {items, maxEndTime};
}