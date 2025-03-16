export const isEmpty = (dataName, dataValue, message) => {
  const emtpy =
    typeof dataValue === "string" ? dataValue.trim() === "" : !dataValue;
  if (emtpy) {
    return { [dataName]: message };
  }
};

export const minMaxLength = (dataName, dataValue, min, max) => {
  const length = dataValue.length;
  if (min && length < min) {
    return {
      [dataName]: `${dataName} must be at least ${min} characters long`,
    };
  }

  if (max && length > max) {
    return {
      [dataName]: `${dataName} cannot exceed ${max} characters`,
    };
  }
};

export const notmatchTheRegex = (dataName, dataValue, regex, message) => {
  const match = regex.test(dataValue);

  if (!match) {
    return { [dataName]: message };
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
