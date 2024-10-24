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

function targetHTML(task, ECEFCoords) {
  return `<!--HTML-->
    <div style="color: white;">
      <p><b>Name:</b> ${task.name}</p>
      <p><b>Type:</b> ${task.type}</p>
      <p><b>Max Times:</b> ${task.maxTimes}</p>
      <p><b>Target Name:</b> ${task.targetName}</p>
      <p><b>Target Type:</b> ${task.targetType}</p>
      <p><b>Target Value:</b> ${task.targetValue}</p>
      <p><b>Latitude:</b> ${task.latitude}</p>
      <p><b>Longitude:</b> ${task.longitude}</p>
      <p><b>Altitude:</b> ${task.altitude}</p>
      <p><b>ECEF Coordinates:</b> ${ECEFCoords.join(', ')}</p>
      <p><b>Dynamic State Type:</b> ${task.dynamicStateType}</p>
      <p><b>Integrator Type:</b> ${task.integratorType}</p>
      <p><b>EOMS Type:</b> ${task.eomsType}</p>
    </div>`;
}

function targetToCzmlPackets(task) {
  const ECEFCoords = latLonToECEF(task.latitude, task.longitude, task.altitude);

  return {
    id: task.id,
    name: task.name,
    description: targetHTML(task, ECEFCoords),
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
      font: "10pt Lucida Console",
      horizontalOrigin: "LEFT",
      pixelOffset: {
        cartesian2: [12, 0]
      },
      show: true,
      style: "FILL",
      text: task.name,
      verticalOrigin: "CENTER"
    },
    position: {
      cartesian: ECEFCoords
    }
  }
}

function tasksToCzmlPackets(taskList) {
  const packets = [];

  taskList.forEach((task) => packets.push(targetToCzmlPackets(task)));

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
