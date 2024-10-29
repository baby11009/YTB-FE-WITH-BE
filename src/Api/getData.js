import request from "../util/axios-base-url";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "../util/tokenHelpers";

export const getData = (
  path,
  params = {},
  condition = true,
  suspense = true
) => {
  const paramsValue = Object.values(params);

  const paramsKey = Object.keys(params);

  const notParamsResetKeys = Object.keys(params).filter(
    (key) => !key.includes("reset") && !key.includes("clearCache")
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
        return null;
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

  const token = getCookie(import.meta.env.VITE_AUTH_TOKEN);

  return useQuery({
    queryKey: [...paramsValue],
    queryFn: async () => {
      try {
        const res = await request.get(path, {
          params: {
            ...finalParams,
          },
          headers: {
            Authorization: `${import.meta.env.VITE_AUTH_BEARER} ${token}`,
          },
        });

        return res.data;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    enabled: condition,
    suspense: suspense,
  });
};
