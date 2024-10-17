const { cos, sin, PI } = Math;
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

  const N = WGS84_A / Math.sqrt(1 - WGS84_E ** 2 * slat ** 2);
  const x = (N + alt) * clat * clon;
  const y = (N + alt) * clat * slon;
  const z = (N * (1 - WGS84_E ** 2) + alt) * slat;

  return [x, y, z];
}

function targetHTML(task, ECEFCoords) {
  return `<!--HTML-->
    <p><b>Name:</b> ${task.name}</p>
    <p><b>Type:</b> ${task.type}</p>
    <p><b>Max Times:</b> ${task.maxTimes}</p>
    <p><b>Target Name:</b> ${task.targetName}</p>
    <p><b>Target Type:</b> ${task.targetType}</p>
    <p><b>Target Value:</b> ${task.targetValue}</p>
    <p><b>Latitude:</b> ${task.latitude}</p>
    <p><b>Longitude:</b> ${task.longitude}</p>
    <p><b>Altitude:</b> ${task.altitude}</p>
    <p><b>ECEF Coordinates:</b> ${ECEFCoords}</p>
    <p><b>Dynamic State Type:</b> ${task.dynamicStateType}</p>
    <p><b>Integrator Type:</b> ${task.integratorType}</p>
    <p><b>EOMS Type:</b> ${task.eomsType}</p>`;
}

function targetToCzmlPackets(task) {
  const ECEFCoords = latLonToECEF(task.latitude, task.longitude, task.altitude);

  return {
    id: task.id,
    name: task.name,
    description: `<!--HTML-->\r\n<p>\r\n ${task.name} \r\n</p>`,
    billboard: {
      eyeOffset: {
        cartesian: [0, 0, 0]
      },
      horizontalOrigin: "CENTER",
      image: "../../public/target.png",
      pixelOffset: {
        cartesian2: [0, 0]
      },
      scale: 1.5,
      show: true,
      verticalOrigin: "CENTER"
    },
    label: {
      fillColor: {
        rgba: [0, 255, 255, 255]
      },
      font: "11pt Lucida Console",
      horizontalOrigin: "LEFT",
      outlineColor: {
        rgba: [0, 0, 0, 255]
      },
      outlineWidth: 2,
      pixelOffset: {
        cartesian2: [12, 0]
      },
      show: true,
      style: "FILL_AND_OUTLINE",
      text: task.name,
      verticalOrigin: "CENTER"
    },
    position: {
      cartesian: ECEFCoords
    }
  }
}

export default function tasksToCzmlPackets(taskList) {
  const czml = [];

  taskList.forEach((task) => czml.push(targetToCzmlPackets(task)));

  return czml;
}