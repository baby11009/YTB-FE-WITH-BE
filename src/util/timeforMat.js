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
