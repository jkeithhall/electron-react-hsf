import { randomId } from '@mui/x-data-grid-generator';
import { julianToDate } from './julianConversion';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export default async function formatTimeline(scheduleContent, startJD) {
  let scheduleValue;
  let events = [];
  let lanes = [];

  const dayjs = await julianToDate(startJD, true);
  const utcDate = dayjs.utc();
  const startTime = utcDate.valueOf();

  const lines = scheduleContent.split("\n").filter((line) => line !== "");

  lines.forEach((line, index) => {
    if (index === 0) {
      scheduleValue = line.split("Schedule Value: ")[1];
    } else {
      const cleanTokens = splitEventEndFromName(line);

      if (index === 1) lanes = lanes.concat(getLanes(cleanTokens));

      events = events.concat(getEvents(cleanTokens, utcDate));
    }
  });

  return { scheduleValue, startTime, events, lanes };
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

function getLanes(tokens) {
  const lanes = [];
  tokens.forEach((token, index) => {
    const name = token.split(":")[0];
    if (index % 10 === 0) lanes.push({ laneId: index / 10, label: name });
  });

  return lanes;
}

class Event {
  constructor(eventId, tooltip, startTimeMillis, endTimeMillis, laneId) {
    this.eventId = eventId;
    this.tooltip = tooltip;
    this.startTimeMillis = startTimeMillis;
    this.endTimeMillis = endTimeMillis;
    this.laneId = laneId;
  }
}

function getEvents(tokens, dayjs) {
  const events = [];

  let currEvent = new Event();
  let currTask = new Event();

  tokens.forEach((token, index) => {
    switch (index % 10) {
      case 1: // Event/Task Name
        currEvent.eventId = randomId();
        currTask.eventId = randomId();
        currEvent.laneId = Math.floor(index / 10);
        currTask.laneId = Math.floor(index / 10);
        currEvent.tooltip = `${token} Event`;
        currTask.tooltip = `${token} Task`;
        break;
      case 3: // Task Start
        const taskStart = parseInt(token);
        const taskStartMillis = dayjs.clone().add(taskStart, 'seconds').valueOf();
        currTask.startTimeMillis = taskStartMillis;
        break;
      case 5: // Event Start
        const eventStart = parseInt(token);
        const eventStartMillis = dayjs.clone().add(eventStart, 'seconds').valueOf();
        currEvent.startTimeMillis = eventStartMillis;
        break;
      case 7: // Task End
        const taskEnd = parseInt(token);
        const taskEndMillis = dayjs.clone().add(taskEnd, 'seconds').valueOf();
        currTask.endTimeMillis = taskEndMillis;
        events.push({ ...currTask });
        break;
      case 9: // Event End
        const eventEnd = parseInt(token);
        const eventEndMillis = dayjs.clone().add(eventEnd, 'seconds').valueOf();
        currEvent.endTimeMillis = eventEndMillis;
        events.push({ ...currEvent });
        break;
      default:
        break;
    }
  });

  return events;
}