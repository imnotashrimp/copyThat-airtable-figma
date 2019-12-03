export const stringifyDatetime = () => {
  let dateTime = new Date();

  return {
    date: dateString(dateTime),
    time: timeString(dateTime)
  };
}

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const addLeadingZero = (num: number) => {
  // Append leading zero to one-digit numbers (e.g., 1 => 01)
  return num <= 9 ? '0' + num : num;
}

const dateString = (dateTime) => {
  return dateTime.getDate()
    + ' ' + (months[dateTime.getMonth()]) // get name of month
    + ' ' + dateTime.getFullYear(); // get four-digit year
}

const timeString = (dateTime) => {
  return addLeadingZero(dateTime.getHours())
    + ':' + addLeadingZero(dateTime.getMinutes());
}
