export const isEmpty = (dataName, dataValue, setSubmitErrs) => {
  const emtpy = dataValue.trim() === "";
  if (emtpy) {
    setSubmitErrs((prev) => ({ ...prev, [dataName]: "Cannot be empty" }));
    return true;
  }
};

export const notmatchTheRegex = (dataName, dataValue, regex, setSubmitErrs) => {
  const match = regex.test(dataValue);
 
  if (!match) {
    setSubmitErrs((prev) => ({ ...prev, [dataName]: "Not valid" }));

    return true;
  }
};

export const notChanged = (
  dataName,
  dataValue,
  defaultValue,
  setSubmitErrs,
) => {
  const changed = JSON.stringify(dataValue) === JSON.stringify(defaultValue);
  if (!changed) {
    setSubmitErrs((prev) => ({ ...prev, [dataName]: "Not changed" }));
    return true;
  }
};
