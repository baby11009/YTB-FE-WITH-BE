import request from "../util/axios-base-url";
import { getCookie } from "../util/tokenHelpers";

export const createData = async (
  path,
  data,
  dataType,
  handleSuccess,
  handleFinally,
  addToaster,
) => {
  const cfirm = confirm(`Are you sure you want to create new ${dataType}?`);

  if (!cfirm) {
    alert(`Cancel create of ${dataType}`);
    return;
  }

  try {
    const newData = await request
      .post(path, data, {
        headers: {
          Authorization: `${import.meta.env.VITE_AUTH_BEARER} ${getCookie(
            import.meta.env.VITE_AUTH_TOKEN,
          )}`,
        },
      })
      .then((rsp) => {
        if (handleSuccess) {
          handleSuccess(rsp);
        }
      })
      .finally(() => {
        if (handleFinally) {
          handleFinally();
        }
      });

    addToaster(`New ${dataType} created successfully`);

    return newData;
  } catch (error) {
    console.error("🚀 ~ error:", error);
    alert(error.response.data.msg);
  }
};

export const dltData = async (
  path,
  id,
  dataType,
  handleSuccess,
  handleFinally,
  addToaster,
) => {
  const cfirm = confirm(`Are you sure you want to delete this ${dataType}?`);

  if (!cfirm) {
    alert(`Cancel delete of ${dataType}`);
    return;
  }

  try {
    const dltData = await request
      .delete(`${path}/${id}`, {
        headers: {
          Authorization: `${import.meta.env.VITE_AUTH_BEARER} ${getCookie(
            import.meta.env.VITE_AUTH_TOKEN,
          )}`,
        },
      })
      .then((rsp) => {
        if (handleSuccess) {
          handleSuccess(rsp);
        }
      })
      .finally(() => {
        if (handleFinally) {
          handleFinally();
        }
      });

    addToaster(`Delete ${dataType} successfully`);
  } catch (error) {
    console.log("🚀 ~ error:", error);
    alert(error.response.data.msg);
  }
};

export const dltManyData = async (
  path,
  idList = [],
  dataType,
  handleSuccess,
  handleFinally,
  addToaster,
) => {
  if (idList.length === 0) {
    alert(`Must choose at least one ${dataType}`);
    return;
  }

  const cfirm = confirm(`Are you sure you want to delete these ${dataType}?`);

  if (!cfirm) {
    alert(`Cancel delete of these ${dataType}`);
    return;
  }

  const finalPath = path + "?" + "idList=" + idList.join(",");

  try {
    await request
      .delete(finalPath)
      .then((rsp) => {
        if (handleSuccess) {
          handleSuccess(rsp);
        }
      })
      .finally(() => {
        if (handleFinally) {
          handleFinally();
        }
      });

    addToaster(`Delete ${dataType} successfully`);
  } catch (error) {
    console.log("🚀 ~ error:", error);
    alert(error.response.data.msg);
  }
};

export const updateData = async (
  path,
  id,
  bodyData,
  dataType,
  handleSuccess,
  handleFinally,
  addToaster,
) => {
  const cfirm = confirm(`Are you sure you want to change these ${dataType}?`);

  const apiPath = id ? `${path}/${id}` : path;

  const [firstLetter, ...rest] = dataType;

  if (!cfirm) {
    alert(`Cancel change of these ${dataType}`);
    return;
  }

  try {
    const data = await request
      .patch(apiPath, bodyData, {
        headers: {
          Authorization: `${import.meta.env.VITE_AUTH_BEARER} ${getCookie(
            import.meta.env.VITE_AUTH_TOKEN,
          )}`,
        },
      })
      .then((rsp) => {
        if (handleSuccess) {
          handleSuccess(rsp);
        }
      })
      .finally(() => {
        if (handleFinally) {
          handleFinally();
        }
      });
    addToaster(
      `${firstLetter.toUpperCase()}${rest.join("")} updated successfully`,
    );

    if (data) {
      return data.data;
    }
  } catch (error) {
    console.log("🚀 ~ error:", error);
    alert(error.response.data.msg);
  }
};
