import { getAccessIntervals } from './parseOutputSchedule';
import { julianToDate } from './julianConversion';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const { cos, sin, sqrt, PI } = Math;

const degreesToRadians = degrees => degrees * PI / 180;
const WGS84_A = 6378137.0; // Semi-major axis
const WGS84_B = 6356752.314245; // Semi-minor axis
const WGS84_E = sqrt(1 - (WGS84_B ** 2) / (WGS84_A ** 2)); // Eccentricity

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

function assetHTML(asset) {
  return `<!--HTML-->
    <div style="color: white; font-family: sans-serif;">
      <p><b>Asset Name:</b> ${asset.name}</p>
      <p><b>Dynamic State Type:</b> ${asset.dynamicStateType}</p>
      <p><b>EOMS Type:</b> ${asset.eomsType}</p>
      <p><b>Initial State Data (km/s):</b> ${asset.stateData.join(', ')}</p>
      <p><b>Integrator Options:</b></p>
      <ul>
        <li>h: ${asset.integratorOptions.h}</li>
        <li>rtol: ${asset.integratorOptions.rtol}</li>
        <li>atol: ${asset.integratorOptions.atol}</li>
        <li>eps: ${asset.integratorOptions.eps}</li>
        <li>nSteps: ${asset.integratorOptions.nSteps}</li>
      </ul>
      <p><b>Integrator Parameters:</b></p>
      <ul>
        ${asset.integratorParameters.map(param => `<li>${param.key}: ${param.value} (${param.type})</li>`).join('')}
      </ul>
    </div>`;
}

function addAssetPacketsToCzml(czml, assets, startDatetime, endDatetime, duration /* seconds */) {
  assets.forEach(asset => {
    const [x, y, z, v_x, v_y, v_z] = asset.stateData; // ECI 6D state vector in km and km/s

    const assetPositionsECI = [0, 1000 * x, 1000 * y, 1000 * z]; // Start position in meters
    let [prev_v_x, prev_v_y, prev_v_z] = [v_x * 1000, v_y * 1000, v_z * 1000]; // Convert to m/s
    for (let t = 1; t <= duration; t += 1) { // 1 second intervals
      // Update position
      const [prev_x, prev_y, prev_z] = assetPositionsECI.slice(-3);
      assetPositionsECI.push(t, prev_x + prev_v_x, prev_y + prev_v_y, prev_z + prev_v_z);

      // Calculate acceleration
      const r = Math.sqrt( prev_x ** 2 + prev_y ** 2 + prev_z ** 2 ); // Radius in meters
      const v_squared = prev_v_x ** 2 + prev_v_y ** 2 + prev_v_z ** 2; // Velocity squared
      const a = v_squared / r; // Acceleration a = v^2/r in m/s^2

      // Update velocity components
      prev_v_x -= a * (prev_x / r);
      prev_v_y -= a * (prev_y / r);
      prev_v_z -= a * (prev_z / r);
    }

    czml.push({
      id: asset.name,
      name: asset.name,
      availability: `${startDatetime}/${endDatetime}`,
      description: assetHTML(asset),
      billboard: {
        eyeOffset: {
          cartesian: [0, 0, 0]
        },
        horizontalOrigin: "CENTER",
        image: "data:image/png;base64,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",
        pixelOffset: {
          cartesian2: [0, 0]
        },
        scale: 0.25,
        show: true,
        verticalOrigin: "CENTER"
      },
      label: {
        fillColor: {
          rgba: [0, 255, 0, 255]
        },
        font: "12pt sans-serif",
        horizontalOrigin: "LEFT",
        pixelOffset: {
          cartesian2: [12, 0]
        },
        show: true,
        style: "FILL",
        text: asset.name,
        verticalOrigin: "CENTER"
      },
      path: {
        show: [{
          interval: `${startDatetime}/${endDatetime}`,
          boolean: true
        }],
        width: 1,
        material: {
          solidColor: {
            color: {
              rgba: [0, 255, 0, 255]
            }
          }
        },
        resolution: 10,
      },
      position: {
        interpolationAlgorithm: "LAGRANGE",
        interpolationDegree: 5,
        referenceFrame: "INERTIAL",
        epoch: startDatetime,
        cartesian: assetPositionsECI
      }
    });
  });
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
      image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAA5lJREFUeF7tW22W2yAMNCdr92Ttnqzbk9FoH+QpCqDRh+3uxvnVbsCg0WgkGVK2F/+UF7d/Ow2AWuvPbdt+NQe8l1I+znDGmQD82baNQKDPRynl7dUAqNzgUsopzjhlUTK81noBcDGAIfDtQ6CpPplMwveDCWCHgbLAXyaKh2SFXTWApbqu9lahf6cJN338bZ2Ijt8FgJu+0YZ7jkf3oo2jWiEdiFQAEjyugUDfpwKRBkCtlRc2I0N6TFOc079pPP9QIdRDRWNPGghhAJrXpTHcMDL2qdTV6oAWRvScFRhv0RI6BIAS60svaQBwBCPraDHlBmCxqaHH5UYsALTKkcKDN1D8ke6QcAGwoD28EaEZcDO0AN4VDl4AHur45grYeOZRVzs8A8FTTZoBmCxuMl6LS+T7yT5gJvU1TAD8L8b3zU/2YwoFKwCS+od7fiCmsv4wsQAGIANthNrWMRNBhh1jASDF+23DsiO8d4Keen/kHFQQIQAiC7B47Tlc6wyhOkKrK26tNaQFXgBgirWU5+kOrWu4tAAFwE3/YGsMgzDSAiQMVAC8D2bFzqpRQjQPonJbT7JAnYsAIOlr8YrWIiMAwGlt0JKfB0CQ+hIY1ZCJ1qjOQhhgplVA+GaMUA2ZhJzKnjsAgddZsxceGfTvgDwZkrVfDkBkw6MNjjpGJOaHY6SiA6/gVmvd93sB4KjUJLLfIwRmfPGkli8pggsAXHUA8LbYogdoFjDvFUmD1Lzwak5NLSysIsI6zQCZztobAAmexet9LFQEtbCTmUedqwLgfTBjgacT7NMh6s/6jpRmaNJkwGEQEETYeG8ZTPNQBjxRGUGX891QuWW9EIEAhACYhAG0gAx6dubHL0n0V2LELPPFiMgbKwsAo1hWRcajetY58pjNcoQOA5ChBVbDkPER78MaIMpl+YbHFQqIcdqYjIMaEwMmLKA/Hw5ChvFmBjAmvO7h6KzoaODATPjSx+NKcUNX29R05rwgQcfpo4MVGHipK2YNEMXNqsw96opMKBWHAFDC4V7Pf4qNuOOnMQCoHF0VYyoDDGx4AEO5JkcVIn1WZ4imXmSVTsMMcICgpffV9yle5wukAsDSZKQFHgGQbnhfZBcABBD0X+3m58zruxl+CAAiPPo9P/rz6rr8Zzfo6Qo9sbUrA1Yb0rKAxxjPnAsAD2oZcy4GXL8ae/h9QVphY2XnmRrw2j+dtXpqr/GnMWAvg6zP/QcCKYFfYULRwwAAAABJRU5ErkJggg==",
      pixelOffset: {
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

function addTaskPacketsToCzml(czml, taskList) {
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

  Object.values(targets).forEach(target => czml.push(targetToCzmlPacket(target)));
}

async function fetchAccessIntervals(outputPath, fileName) {
  return new Promise((resolve, reject) => {
      if (window.electronApi) {
        window.electronApi.fetchLatestTimelineData(outputPath, fileName, ({ content }) => {
          const firstSchedule = content.split("Schedule Number: ")[1].slice(1);
          const accessIntervals = getAccessIntervals(firstSchedule);
          resolve(accessIntervals);
        });
      } else {
        reject("No electron API found");
      }
    });
}

function getAccessShowIntervals(taskIntervals, startSeconds, endSeconds, startDate) {
  const oneSecondIntervals = [];

  // First pass: create 1-second intervals with boolean values
  for (let seconds = startSeconds; seconds < endSeconds; seconds++) {
    const isInTaskInterval = taskIntervals.some(interval =>
      seconds >= interval.start && seconds < interval.end
    );

    oneSecondIntervals.push({
      start: seconds,
      end: seconds + 1,
      boolean: isInTaskInterval
    });
  }

  const showIntervals = [];
  let currentInterval = oneSecondIntervals[0];

  // Second pass: combine consecutive intervals with the same boolean
  for (let i = 1; i < oneSecondIntervals.length; i++) {
    const interval = oneSecondIntervals[i];

    // If the boolean value is the same, extend the current interval
    if (interval.boolean === currentInterval.boolean) {
      currentInterval.end = interval.end;
    } else {
      // Finalize the current interval, converting it to ISO
      const startISO = startDate.clone().add(currentInterval.start, 'seconds').format();
      const endISO = startDate.clone().add(currentInterval.end, 'seconds').format();
      showIntervals.push({
        interval: `${startISO}/${endISO}`,
        boolean: currentInterval.boolean
      });

      // Start a new interval
      currentInterval = interval;
    }
  }

  // Push the last interval
  const startISO = startDate.clone().add(currentInterval.start, 'seconds').format();
  const endISO = startDate.clone().add(currentInterval.end, 'seconds').format();
  showIntervals.push({
    interval: `${startISO}/${endISO}`,
    boolean: currentInterval.boolean
  });

  return showIntervals;
}

function accessHTML(accessName, showIntervals) {
  return `<!--HTML-->
    <div style="color: white; font-family: sans-serif;">
      <p><b>${accessName.split("/")[0]}&ndash;${accessName.split("/")[1]} Access Intervals</b></p>
      <ul>
        ${showIntervals
          .filter(interval => interval.boolean)
          .map(({interval}) => {
            const [start, end] = interval.split('/');
            return `<li>Start: ${start} End: ${end}</li>`;
          })
          .join('')
        }
      </ul>
    </div>`;
}

async function addAccessesToCzml(czml, outputPath, fileName, startDate, startSeconds, endSeconds) {
  const accessIntervals = await fetchAccessIntervals(outputPath, fileName);
  const startDatetime = startDate.clone().add(startSeconds, 'seconds').toISOString();
  const endDatetime = startDate.clone().add(endSeconds, 'seconds').toISOString();

  Object.entries(accessIntervals).forEach(([accessName, {taskIntervals, eventIntervals}]) => {
    const showIntervals = getAccessShowIntervals(taskIntervals, startSeconds, endSeconds, startDate);
    czml.push({
      id: accessName,
      name: accessName,
      availability: `${startDatetime}/${endDatetime}`,
      description: accessHTML(accessName, showIntervals),
      polyline: {
        show: showIntervals,
        width: 1,
        arcType: "NONE",
        positions: {
          references: [
            `${accessName.split("/")[0]}#position`, // From
            `${accessName.split("/")[1]}#position`   // To
          ]
        }
      }
    });
  });
}

async function buildCzmlPackets(name, version, startJD, startSeconds, endSeconds, componentList, outputPath, fileName, taskList) {
  const timeStamp = fileName.split('.')[0].slice(7);
  const dayjs = await julianToDate(startJD, true);
  const utcDate = dayjs.utc();
  const startDatetime = utcDate.clone().add(startSeconds, 'seconds').toISOString();
  const endDatetime = utcDate.clone().add(endSeconds, 'seconds').toISOString();
  const duration = endSeconds - startSeconds;
  const assets = componentList.filter(component => !component.parent);

  const czml = [{
    id: "document",
    name: `${name} ${version} - ${timeStamp}`,
    version: "1.0", // CZML version (must be 1.0)
    clock: {
      interval: `${startDatetime}/${endDatetime}`,
      currentTime: `${startDatetime}`,
      multiplier: 15, // 15x speed
      range: "LOOP_STOP",
      step: "SYSTEM_CLOCK_MULTIPLIER"
    }
  }];

  addAssetPacketsToCzml(czml, assets, startDatetime, endDatetime, duration);
  addTaskPacketsToCzml(czml, taskList);
  await addAccessesToCzml(czml, outputPath, fileName, utcDate, startSeconds, endSeconds);
  return czml;
}

export { buildCzmlPackets, addTaskPacketsToCzml };