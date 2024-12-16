import request from "../util/axios-base-url";
import { useQuery } from "@tanstack/react-query";

export const getData = (
  path,
  params = {},
  condition = true,
  suspense = false,
) => {
  if (!path) {
    return null;
  }

  const paramsValue = [...Object.values(params)];
  const paramsKey = [...Object.keys(params)];

  const notParamsResetKeys = paramsKey.filter(
    (key) => key !== "refetch" && key !== "clearCache" && key !== "reset",
  );

  let finalParams = {};

  if (paramsKey.length > 0) {
    const notParamsResetKeys = paramsKey.filter(
      (key) => key !== "refetch" && key !== "clearCache" && key !== "reset",
    );

    if (paramsKey.length !== notParamsResetKeys.length) {
      notParamsResetKeys.forEach((key) => {
        finalParams[key] = params[key];
      });
    } else {
      finalParams = params;
    }
  }

  return useQuery({
    queryKey: [...paramsValue, path],
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
        alert(
          error.response?.data?.msg || error.response?.data || error.message,
        );
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
  suspense = true,
) => {
  if (!path) {
    return null;
  }

  const paramsValue = [...Object.values(params)];

  const paramsKey = [...Object.keys(params)];

  let finalParams = {};

  if (paramsKey.length > 0) {
    const notParamsResetKeys = paramsKey.filter(
      (key) => key !== "refetch" && key !== "clearCache" && key !== "reset",
    );

    if (paramsKey.length !== notParamsResetKeys.length) {
      notParamsResetKeys.forEach((key) => {
        finalParams[key] = params[key];
      });
    } else {
      finalParams = params;
    }
  }

  return useQuery({
    queryKey: [...paramsValue, path],
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
        alert(
          error.response?.data?.msg || error.response?.data || error.message,
        );
        throw error;
      }
    },

    enabled: condition,
    suspense: suspense,
  });
};
