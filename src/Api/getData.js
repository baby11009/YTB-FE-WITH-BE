import request from "../util/axios-base-url";
import { useQuery } from "@tanstack/react-query";

export const getData = (
  path,
  params = {},
  condition = true,
  suspense = false
) => {
  if (!path) {
    return null;
  }

  const paramsValue = Object.values(params);
  const paramsKey = Object.keys(params);

  const notParamsResetKeys = Object.keys(params).filter(
    (key) => key !== "refetch" && key !== "clearCache" && key !== "reset"
  );

  let finalParams = {};

  if (paramsKey.length !== notParamsResetKeys.length) {
    notParamsResetKeys.map((key) => {
      finalParams[key] = params[key];
    });
  } else {
    finalParams = params;
  }

  return useQuery({
    queryKey: paramsValue,
    queryFn: async () => {
      try {
        const res = await request.get(path, {
          params: {
            ...finalParams,
          },
        });
        return res.data;
      } catch (error) {
        console.error(error);
        alert(error.response.data.msg || error.response.data);
        throw error;
      }
    },
    enabled: condition,
    suspense,
  });
};

export const getDataWithAuth = (
  path,
  params = {},
  condition = true,
  suspense = true
) => {
  if (!path) {
    return null;
  }
  const paramsValue = Object.values(params);

  const paramsKey = Object.keys(params);

  let finalParams = {};
  
  if (paramsKey.length > 0) {
    const notParamsResetKeys = Object.keys(params).filter(
      (key) => !key.includes("reset") && !key.includes("clearCache")
    );

    if (paramsKey.length !== notParamsResetKeys.length) {
      notParamsResetKeys.map((key) => {
        finalParams[key] = params[key];
      });
    } else {
      finalParams = params;
    }
  }

  return useQuery({
    queryKey: [...paramsValue],
    queryFn: async () => {
      try {
        const res = await request.get(path, {
          params: {
            ...finalParams,
          },
        });

        return res.data;
      } catch (error) {
        console.error(error);
        alert(error.response.data.msg || error.response.data);
        throw error;
      }
    },
    enabled: condition,
    suspense: suspense,
  });
};
