export const getTimeFromTimeStamp = (timeStamp) => {
  const pad = (num) => ('0' + num).slice(-2);
  const date = new Date(timeStamp * 1000);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let day = date.getDate();
  let month = +date.getMonth() + 1;
  let year = date.getUTCFullYear();
  return (
    pad(day) +
    '/' +
    pad(month) +
    '/' +
    pad(year) +
    ' at ' +
    pad(hours) +
    ':' +
    pad(minutes)
  );
};
