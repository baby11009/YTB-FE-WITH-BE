import request from "../util/axios-base-url";
import { getCookie } from "../util/tokenHelpers";

export const createData = async (path, data) => {
  const cfirm = confirm(`Are you sure you want to create new ${path}?`);

  if (!cfirm) {
    alert(`Cancel create of ${path}`);
    return;
  }

  try {
    const newData = await request.post(path, data, {
      headers: {
        Authorization: `${import.meta.env.VITE_AUTH_BEARER} ${getCookie(
          import.meta.env.VITE_AUTH_TOKEN
        )}`,
      },
    });

    console.log("🚀 ~ newData:", newData);

    alert(`New ${path} created successfully`);

    return newData;
  } catch (error) {
    console.log("🚀 ~ error:", error);
    alert(error.response.data.msg);
  }
};

export const dltData = async (path, id) => {
  const cfirm = confirm(`Are you sure you want to delete this ${path}?`);

  if (!cfirm) {
    alert(`Cancel delete of ${path}`);
    return;
  }

  try {
    const dltData = await request.delete(`${path}/${id}`, {
      headers: {
        Authorization: `${import.meta.env.VITE_AUTH_BEARER} ${getCookie(
          import.meta.env.VITE_AUTH_TOKEN
        )}`,
      },
    });

    console.log("🚀 ~ dltData:", dltData);

    alert(dltData.data?.msg);
  } catch (error) {
    console.log("🚀 ~ error:", error);
    alert(error.response.data.msg);
  }
};

export const dltManyData = async (path, idList = []) => {
  if (idList.length === 0) {
    alert(`Must choose at least one ${path}`);
    return;
  }

  const cfirm = confirm(`Are you sure you want to delete these data?`);

  if (!cfirm) {
    alert(`Cancel delete of these data`);
    return;
  }

  try {
    const dltDatas = await request.post(
      `${path}`,
      {
        idList,
      },
      {
        headers: {
          Authorization: `${import.meta.env.VITE_AUTH_BEARER} ${getCookie(
            import.meta.env.VITE_AUTH_TOKEN
          )}`,
        },
      }
    );

    console.log("🚀 ~ dltData:", dltDatas);

    alert(dltDatas.data?.msg);
  } catch (error) {
    console.log("🚀 ~ error:", error);
    alert(error.response.data.msg);
  }
};

export const updateData = async (path, id, bodyData) => {
  const cfirm = confirm(`Are you sure you want to change these ${path}?`);

  const [firstLetter, ...rest] = path;

  if (!cfirm) {
    alert(`Cancel change of these ${path}`);
    return;
  }

  try {
    const data = await request.patch(`${path}/${id}`, bodyData, {
      headers: {
        Authorization: `${import.meta.env.VITE_AUTH_BEARER} ${getCookie(
          import.meta.env.VITE_AUTH_TOKEN
        )}`,
      },
    });
  

    alert(`${firstLetter.toUpperCase()}${rest.join("")} updated successfully`);
    return data.data;
  } catch (error) {
    console.log("🚀 ~ error:", error);
    alert(error.response.data.msg);
  }
};
