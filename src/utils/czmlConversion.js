import { julianToDate } from './julianConversion';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const { cos, sin, sqrt, PI } = Math;

const degreesToRadians = degrees => degrees * PI / 180;
const WGS84_A = 6378137.0; // Semi-major axis
const WGS84_B = 6356752.314245; // Semi-minor axis
const WGS84_E = Math.sqrt(1 - (WGS84_B ** 2) / (WGS84_A ** 2)); // Eccentricity

// Convert latitude, longitude, and altitude to ECEF coordinates in meters
function latLonToECEF(lat, lon, alt) {
  const clat = cos(degreesToRadians(lat));
  const slat = sin(degreesToRadians(lat));
  const clon = cos(degreesToRadians(lon));
  const slon = sin(degreesToRadians(lon));

  const N = WGS84_A / sqrt(1 - WGS84_E ** 2 * slat ** 2);
  const x = (N + alt) * clat * clon;
  const y = (N + alt) * clat * slon;
  const z = (N * (1 - WGS84_E ** 2) + alt) * slat;

  return [x, y, z];
}

function targetHTML(target) {
  const tasksHTML = target.tasks.map(task => {
    return `<li>${task.name} (${task.type}; Max Times: ${task.maxTimes})</li>`;
  })
  return `<!--HTML-->
    <div style="color: white; font-family: sans-serif;">
      <p><b>Target Name:</b> ${target.name}</p>
      <p><b>Target Type:</b> ${target.type}</p>
      <p><b>Target Value:</b> ${target.targetValue}</p>
      <p><b>Latitude:</b> ${target.latitude}</p>
      <p><b>Longitude:</b> ${target.longitude}</p>
      <p><b>Altitude:</b> ${target.altitude}</p>
      <p><b>ECEF Coordinates:</b> ${target.ECEFCoords.join(', ')}</p>
      <p><b>Dynamic State Type:</b> ${target.dynamicStateType}</p>
      <p><b>Integrator Type:</b> ${target.integratorType}</p>
      <p><b>EOMS Type:</b> ${target.eomsType}</p>
      <p><b>Tasks:</b></p>
      <ul>${tasksHTML.join('')}</ul>
    </div>`;
}

function targetToCzmlPacket(target) {
  return {
    id: target.id,
    name: target.name,
    description: targetHTML(target),
    billboard: {
      eyeOffset: {
        cartesian: [0, 0, 0]
      },
      horizontalOrigin: "CENTER",
      image: "/Users/keithhall/Documents/Projects/electron-react-hsf/src/target.png",
      pixelOffset: {
        cartesian2: [0, 0]
      },
      scale: 1.5,
      show: true,
      verticalOrigin: "CENTER"
    },
    label: {
      fillColor: {
        rgba: [255, 255, 255, 255]
      },
      font: "10pt sans-serif",
      horizontalOrigin: "LEFT",
      pixelOffset: {
        cartesian2: [12, 0]
      },
      show: true,
      style: "FILL",
      text: target.name,
      verticalOrigin: "CENTER"
    },
    position: {
      cartesian: target.ECEFCoords
    }
  }
}

function tasksToCzmlPackets(taskList) {
  const packets = [];
  const targets = {};

  taskList.forEach((task) => {
    const { targetName } = task;
    if (!targets[targetName]) {
      targets[targetName] = {
        id: targetName,
        name: targetName,
        type: task.targetType,
        targetValue: task.targetValue,
        latitude: task.latitude,
        longitude: task.longitude,
        altitude: task.altitude,
        ECEFCoords: latLonToECEF(task.latitude, task.longitude, task.altitude),
        dynamicStateType: task.dynamicStateType,
        integratorType: task.integratorType,
        eomsType: task.eomsType,
        tasks: [
          {
            name: task.name,
            type: task.type,
            maxTimes: task.maxTimes
          }
        ]
      }
    } else {
      targets[targetName].tasks.push({
        name: task.name,
        type: task.type,
        maxTimes: task.maxTimes
      });
    }
  });

  Object.values(targets).forEach(target => packets.push(targetToCzmlPacket(target)));

  return packets;
}



export default async function buildCzmlPackets(startJD, startTime, endTime, taskList) {
  const dayjs = await julianToDate(startJD, true);
  const utcDate = dayjs.utc();
  const startDatetime = utcDate.clone().add(startTime, 'seconds').toISOString();
  const endDatetime = utcDate.clone().add(endTime, 'seconds').toISOString();

  const czml = [{
    id: "document",
    name: "simple",
    version: "1.0",
    clock: {
      interval:`${startDatetime}/${endDatetime}`,
      currentTime: `${startDatetime}`,
      multiplier: 60,
      range: "LOOP_STOP",
      step: "SYSTEM_CLOCK_MULTIPLIER"
    }
  }];

  czml.push(...tasksToCzmlPackets(taskList));
  return czml;
}
