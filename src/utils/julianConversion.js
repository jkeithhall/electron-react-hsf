import dayjs from 'dayjs';

// JD is days since January 1, 4713 BC
const JULIAN_START_YEAR = -4713;
// UTC starts January 1, 1970
const UTC_START_YEAR = 1970;
const yearsDifference = UTC_START_YEAR - JULIAN_START_YEAR;
const daysDifference = yearsDifference * 365.25;

const julianToDate = (jd) => {
  const days = jd - daysDifference;
  const milliseconds = days * 24 * 60 * 60 * 1000;

  return dayjs(new Date(milliseconds));
}

const dateToJulian = ({ $d }) => {
  const utcDate = new Date($d);
  const milliseconds = utcDate.getTime();
  const days = milliseconds / (24 * 60 * 60 * 1000);

  return Math.round(days + daysDifference);
}

export { julianToDate, dateToJulian };