export const durationCalc = (duration) => {
  let remainDuration = duration || 0;
  let result = "";
  if (remainDuration > 60 * 60) {
    const hours = Math.trunc(remainDuration / (60 * 60));
    result += hours.toString().padStart(2, "0") + ":";
    remainDuration = remainDuration - hours * 60 * 60;
  }

  const mins = Math.trunc(remainDuration / 60);
  result += mins.toString().padStart(2, "0") + ":";

  // seccond
  result += (remainDuration - mins * 60).toString().padStart(2, "0");

  return result;
};
