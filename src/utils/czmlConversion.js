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
      image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAA5lJREFUeF7tW22W2yAMNCdr92Ttnqzbk9FoH+QpCqDRh+3uxvnVbsCg0WgkGVK2F/+UF7d/Ow2AWuvPbdt+NQe8l1I+znDGmQD82baNQKDPRynl7dUAqNzgUsopzjhlUTK81noBcDGAIfDtQ6CpPplMwveDCWCHgbLAXyaKh2SFXTWApbqu9lahf6cJN338bZ2Ijt8FgJu+0YZ7jkf3oo2jWiEdiFQAEjyugUDfpwKRBkCtlRc2I0N6TFOc079pPP9QIdRDRWNPGghhAJrXpTHcMDL2qdTV6oAWRvScFRhv0RI6BIAS60svaQBwBCPraDHlBmCxqaHH5UYsALTKkcKDN1D8ke6QcAGwoD28EaEZcDO0AN4VDl4AHur45grYeOZRVzs8A8FTTZoBmCxuMl6LS+T7yT5gJvU1TAD8L8b3zU/2YwoFKwCS+od7fiCmsv4wsQAGIANthNrWMRNBhh1jASDF+23DsiO8d4Keen/kHFQQIQAiC7B47Tlc6wyhOkKrK26tNaQFXgBgirWU5+kOrWu4tAAFwE3/YGsMgzDSAiQMVAC8D2bFzqpRQjQPonJbT7JAnYsAIOlr8YrWIiMAwGlt0JKfB0CQ+hIY1ZCJ1qjOQhhgplVA+GaMUA2ZhJzKnjsAgddZsxceGfTvgDwZkrVfDkBkw6MNjjpGJOaHY6SiA6/gVmvd93sB4KjUJLLfIwRmfPGkli8pggsAXHUA8LbYogdoFjDvFUmD1Lzwak5NLSysIsI6zQCZztobAAmexet9LFQEtbCTmUedqwLgfTBjgacT7NMh6s/6jpRmaNJkwGEQEETYeG8ZTPNQBjxRGUGX891QuWW9EIEAhACYhAG0gAx6dubHL0n0V2LELPPFiMgbKwsAo1hWRcajetY58pjNcoQOA5ChBVbDkPER78MaIMpl+YbHFQqIcdqYjIMaEwMmLKA/Hw5ChvFmBjAmvO7h6KzoaODATPjSx+NKcUNX29R05rwgQcfpo4MVGHipK2YNEMXNqsw96opMKBWHAFDC4V7Pf4qNuOOnMQCoHF0VYyoDDGx4AEO5JkcVIn1WZ4imXmSVTsMMcICgpffV9yle5wukAsDSZKQFHgGQbnhfZBcABBD0X+3m58zruxl+CAAiPPo9P/rz6rr8Zzfo6Qo9sbUrA1Yb0rKAxxjPnAsAD2oZcy4GXL8ae/h9QVphY2XnmRrw2j+dtXpqr/GnMWAvg6zP/QcCKYFfYULRwwAAAABJRU5ErkJggg==",      pixelOffset: {
        cartesian2: [0, 0]
      },
      scale: 0.25,
      show: true,
      verticalOrigin: "CENTER",
      translucencyByDistance: {
        nearFarScalar: [0, 1, 15000000, 0.5]
      },
    },
    label: {
      fillColor: {
        rgba: [255, 255, 255, 255]
      },
      font: "12pt sans-serif",
      horizontalOrigin: "LEFT",
      pixelOffset: {
        cartesian2: [12, 0]
      },
      show: true,
      style: "FILL",
      text: target.name,
      verticalOrigin: "CENTER",
      distanceDisplayCondition: {
        distanceDisplayCondition: [0, 5000000]
      }
    },
    position: {
      cartographicDegrees: [target.longitude, target.latitude, target.altitude]
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
      interval: `${startDatetime}/${endDatetime}`,
      currentTime: `${startDatetime}`,
      multiplier: 15,
      range: "LOOP_STOP",
      step: "SYSTEM_CLOCK_MULTIPLIER"
    }
  }];

  czml.push(...tasksToCzmlPackets(taskList));
  return czml;
}
