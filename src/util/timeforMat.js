// Time Split

const timeSplit = (timeSplit) => {
  let tiSp = timeSplit.split(" ");

  let date = tiSp[0].split("/");

  let time = tiSp[1].split(":");

  let dn = tiSp[2];

  let hour = Number(time[0]);
  if (dn === "PM") {
    hour = Number(time[0]) + 12;
  }

  return {
    day: Number(date[1]),
    month: Number(date[0]),
    year: Number(date[2]?.replace(/,/g, "")),
    hour,
    min: Number(time[1]),
    sec: Number(time[1]),
  };
};

// format time : mm/dd/yyyy, hh:mm:ss AM/PM

export const timeFormat = (time = "07/05/2024, 09:00:00 AM") => {
  // split var date
  let timeSp = timeSplit(time);

  // split current date

  let currDate = new Date().toLocaleString();

  let currDateSp = timeSplit(currDate);

  if (currDateSp.year > timeSp.year) {
    if (
      currDateSp.year - timeSp.year === 1 &&
      currDateSp.month + 12 - timeSp.month < 12
    ) {
      return `${currDateSp.month + 12 - timeSp.month} tháng trước`;
    }
    return `${currDateSp.year - timeSp.year} năm trước`;
  } else if (currDateSp.month > timeSp.month) {
    if (
      currDateSp.month - timeSp.month === 1 &&
      currDateSp.day + 30 - timeSp.day < 30
    ) {
      return `${currDateSp.day + 30 - timeSp.day} ngày trước`;
    }
    return `${currDateSp.month - timeSp.month} tháng trước`;
  } else if (currDateSp.day > timeSp.day) {
    if (
      currDateSp.day - timeSp.day === 1 &&
      currDateSp.hour + 24 - timeSp.hour < 24
    ) {
      return `${currDateSp.hour + 24 - timeSp.hour} giờ trước`;
    }
    return `${currDateSp.day - timeSp.day} ngày trước`;
  } else if (currDateSp.hour > timeSp.hour) {
    return `${currDateSp.hour - timeSp.hour} giờ trước`;
  } else if (currDateSp.min > timeSp.min) {
    return `${currDateSp.min - timeSp.min} phút trước`;
  } else if (currDateSp.sec >= timeSp.sec) {
    return `${currDateSp.sec - timeSp.sec} phút trước`;
  }
};

// Trả về thời gian cách đây
export const timeFormat2 = (time) => {
  const startTime = new Date(time).getTime();

  const currTime = Date.now();

  const timeElapsed = currTime - startTime;

  const seconds = Math.floor(timeElapsed / 1000);

  const timeUnits = [
    { label: "year", value: 60 * 60 * 24 * 30 * 12 },
    { label: "month", value: 60 * 60 * 24 * 30 },
    { label: "day", value: 60 * 60 * 24 },
    { label: "hour", value: 60 * 60 },
    { label: "minute", value: 60 },
  ];

  const unit = timeUnits.find(({ value }) => seconds >= value);
  const quantity = unit ? Math.floor(seconds / unit.value) : seconds;
  return `${quantity} ${unit ? unit.label : "second"}${
    quantity > 2 ? "s" : ""
  } ago`;
};

// Trả về DD/MM/YYYY
export const timeFormat3 = (time) => {
  const date = new Date(time);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  // Định dạng ngày theo định dạng DD/MM/YYYY
  const formattedDate = `${day.toString().padStart(2, "0")}/${month
    .toString()
    .padStart(2, "0")}/${year}`;

  return formattedDate;
};

// return date time in word format

export const timeFormat4 = (time) => {
  const date = new Date(time);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const monthShortenedForms = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  // Định dạng ngày theo định dạng DD/MM/YYYY
  const formattedDate = `${monthShortenedForms[month - 1]} ${day
    .toString()
    .padStart(2, "0")}, ${year}`;

  return formattedDate;
};
