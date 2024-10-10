import dayjs from 'dayjs';

// Takes a Julian date $jd and returns a dayJS object
const julianToDate = async (jd) => {
  const response = await fetch(`https://aa.usno.navy.mil/api/calendardate?jd=${jd}`);
  const { data } = await response.json();
  let { year, month, day, time } = data[0]; // Time is string in format 'hh:mm:ss.s'

  month = month.toString().padStart(2, '0');
  day = day.toString().padStart(2, '0');
  time = time.padEnd(12, '0');

  return dayjs(`${year}-${month}-${day}T${time}Z`);
}

// Takes a timezone-localized dayJS object and returns the Julian date
const dateToJulian = async ({ $d }) => {
  // $d is a Date object
  const y = $d.getUTCFullYear();
  const M = $d.getUTCMonth();
  const D = $d.getUTCDate();
  const H = $d.getUTCHours();
  const m = $d.getUTCMinutes();
  const s = $d.getUTCSeconds();
  const ms = $d.getUTCMilliseconds();
  const queryDate = `${y}-${M + 1}-${D}`;
  const queryTime = `${H}:${m}:${s}.${ms}`;
  const response = await fetch(`https://aa.usno.navy.mil/api/juliandate?date=${queryDate}&time=${queryTime}`);
  const { data } = await response.json();
  return Math.floor(data[0].jd);
}

export { julianToDate, dateToJulian };