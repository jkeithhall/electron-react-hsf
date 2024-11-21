import { randomId } from "@mui/x-data-grid-generator";
import { julianToDate } from "./julianConversion";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

function getAccessIntervals(scheduleContent) {
  let accessIntervals = {};
  const lines = scheduleContent.split("\n").filter((line) => line !== "");

  lines.forEach((line, index) => {
    if (index === 0) return; // Skip the first line

    const cleanTokens = splitEventEndFromName(line);

    let assetName, targetName, accessName;
    cleanTokens.forEach((token, tokenIndex) => {
      switch (tokenIndex % 10) {
        case 0: // Asset Name
          assetName = token.split(":")[0];
          assetName = assetName[0].toUpperCase() + assetName.slice(1);
          break;
        case 1: // Target Name
          targetName = token;
          accessName = `${assetName}/${targetName}`;
          if (!accessIntervals[accessName]) {
            accessIntervals[accessName] = {
              taskIntervals: [],
              eventIntervals: [],
            };
          }
          break;
        case 3: // Task Start
          const taskStart = parseInt(token);
          accessIntervals[accessName].taskIntervals.push({ start: taskStart });
          break;
        case 5: // Event Start
          const eventStart = parseInt(token);
          accessIntervals[accessName].eventIntervals.push({
            start: eventStart,
          });
          break;
        case 7: // Task End
          const taskEnd = parseInt(token);
          accessIntervals[accessName].taskIntervals[
            accessIntervals[accessName].taskIntervals.length - 1
          ].end = taskEnd;
          break;
        case 9: // Event End
          const eventEnd = parseInt(token);
          accessIntervals[accessName].eventIntervals[
            accessIntervals[accessName].eventIntervals.length - 1
          ].end = eventEnd;
          break;
        default:
          break;
      }
    });
  });

  return accessIntervals;
}

async function parseTimelineData(scheduleContent, startJD) {
  let scheduleValue;
  let startTime = Number.POSITIVE_INFINITY;
  let endTime = Number.NEGATIVE_INFINITY;
  let items = [];
  let groupObj = {}; // Use object for O(1) lookup
  const date = await julianToDate(startJD, true);
  const startDate = date.utc();

  const lines = scheduleContent.split("\n").filter((line) => line !== "");

  lines.forEach((line, index) => {
    // console.log({index, items, groups});
    if (index === 0) {
      scheduleValue = line.split("Schedule Value: ")[1];
    } else {
      const cleanTokens = splitEventEndFromName(line);

      if (index === 1) {
        parseAssetGroups(cleanTokens, groupObj);
      }

      const { lineStartTime, lineEndTime } = parseItemsGroups(
        cleanTokens,
        items,
        groupObj,
        startDate,
      );
      if (lineStartTime < startTime) startTime = lineStartTime;
      if (lineEndTime > endTime) endTime = lineEndTime;
    }
  });

  const startDatetime = startDate.clone().add(startTime, "seconds");
  const endDatetime = startDate.clone().add(endTime, "seconds");

  // Map group object to array
  const groups = Object.values(groupObj).map((group) => {
    if (group.nestedGroups) {
      return {
        id: group.id,
        content: group.content,
        nestedGroups: Object.values(group.nestedGroups), // Map to array
        showNested: group.showNested,
      };
    } else {
      return group;
    }
  });

  return { scheduleValue, startDatetime, endDatetime, items, groups };
}

function separateNumeralName(token) {
  let numeral = "";
  while (token[0] >= "0" && token[0] <= "9") {
    numeral += token[0].trim();
    token = token.slice(1).trim();
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
      cleanTokens.push(token.trim());
    }
  });

  return cleanTokens.slice(1);
};

function parseAssetGroups(tokens, groupObj) {
  tokens.forEach((token, index) => {
    if (index % 10 === 0) {
      const name = token.split(":")[0];
      groupObj[name] = {
        id: name,
        content: name,
        nestedGroups: {}, // Use object to avoid duplicates
        showNested: 0,
      };
    }
  });
}

function parseItemsGroups(tokens, items, groups, startDate) {
  let lineStartTime = Number.POSITIVE_INFINITY;
  let lineEndTime = Number.NEGATIVE_INFINITY;

  const currEvent = {};
  const currTask = {};
  let assetName;

  tokens.forEach((token, index) => {
    switch (index % 10) {
      case 0:
        assetName = token.split(":")[0];
        break;
      case 1: // Event/Task Name
        currEvent.id = randomId();
        currTask.id = randomId();
        currEvent.group = token;
        currTask.group = token;
        currEvent.content = `${token} Event`;
        currTask.content = `${token} Task`;
        currTask.className = "simulation-task";
        currEvent.className = "simulation-event";

        groups[assetName].nestedGroups[token] = token;
        groups[token] = { id: token, content: token };
        break;
      case 3: // Task Start
        const taskStart = parseInt(token);
        if (taskStart < lineStartTime) lineStartTime = taskStart;

        currTask.start = startDate.clone().add(taskStart, "seconds").format();
        break;
      case 5: // Event Start
        const eventStart = parseInt(token);
        if (eventStart < lineStartTime) lineStartTime = eventStart;

        currEvent.start = startDate.clone().add(eventStart, "seconds").format();
        break;
      case 7: // Task End
        const taskEnd = parseInt(token);
        if (taskEnd > lineEndTime) lineEndTime = taskEnd;

        currTask.end = startDate.clone().add(taskEnd, "seconds").format();
        items.push({ ...currTask });
        break;
      case 9: // Event End
        const eventEnd = parseInt(token);
        if (eventEnd > lineEndTime) lineEndTime = eventEnd;

        currEvent.end = startDate.clone().add(eventEnd, "seconds").format();
        items.push({ ...currEvent });
        break;
      default:
        break;
    }
  });

  return { lineStartTime, lineEndTime };
}

export { parseTimelineData, getAccessIntervals };
