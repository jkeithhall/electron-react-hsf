import { randomId } from '@mui/x-data-grid-generator';
import { julianToDate } from './julianConversion';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export default async function formatTimeline(scheduleContent, startJD) {
  let scheduleValue;
  let startTime = Number.POSITIVE_INFINITY
  let endTime = Number.NEGATIVE_INFINITY;
  let items = [];
  let groups = [];
  const dayjs = await julianToDate(startJD, true);
  const utcDate = dayjs.utc();

  const lines = scheduleContent.split("\n").filter((line) => line !== "");

  lines.forEach((line, index) => {
    if (index === 0) {
      scheduleValue = line.split("Schedule Value: ")[1];
    } else {
      const cleanTokens = splitEventEndFromName(line);

      if (index === 1) groups = groups.concat(getGroups(cleanTokens));

      const { items: currItems, lineStartTime, lineEndTime } = getItems(cleanTokens, utcDate);
      items = items.concat(currItems);
      if (lineStartTime < startTime) startTime = lineStartTime;
      if (lineEndTime > endTime) endTime = lineEndTime;
    }
  });

  const startDatetime = utcDate.clone().add(startTime, 'seconds');
  const endDatetime = utcDate.clone().add(endTime, 'seconds');
  return { scheduleValue, startDatetime, endDatetime, items, groups };
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

function getItems(tokens, dayjs) {
  const items = [];
  let lineStartTime = Number.POSITIVE_INFINITY
  let lineEndTime = Number.NEGATIVE_INFINITY;

  const currEvent = {
    id: '',
    content: '',
    start: '',
    end: '',
    // type: 'range',
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
        if (taskStart < lineStartTime) lineStartTime = taskStart;

        // 2024-10-10T05:02:17-07:00 needs to be 2024-10-10T05:02:17
        currTask.start = dayjs.clone().add(taskStart, 'seconds').format();
        break;
      case 5: // Event Start
        const eventStart = parseInt(token);
        if (eventStart < lineStartTime) lineStartTime = eventStart;

        currEvent.start = dayjs.clone().add(eventStart, 'seconds').format();
        break;
      case 7: // Task End
        const taskEnd = parseInt(token);
        if (taskEnd > lineEndTime) lineEndTime = taskEnd;

        currTask.end = dayjs.clone().add(taskEnd, 'seconds').format();
        items.push({ ...currTask });
        break;
      case 9: // Event End
        const eventEnd = parseInt(token);
        if (eventEnd > lineEndTime) lineEndTime = eventEnd;

        currEvent.end = dayjs.clone().add(eventEnd, 'seconds').format();
        items.push({ ...currEvent });
        break;
      default:
        break;
    }
  });

  return {items, lineStartTime, lineEndTime};
}