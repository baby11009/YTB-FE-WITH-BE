import request from "../util/axios-base-url";
import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../Auth Provider/authContext";

export const getData = (
  path,
  params = {},
  condition = true,
  suspense = false,
) => {
  if (!path) {
    return null;
  }

  const { addToaster } = useAuthContext();

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
        console.error(error.response.data);

        if (addToaster) {
          addToaster(
            error.response.data?.message ||
              error.response?.data ||
              error.message,
          );
        }
        throw error;
      }
    },
    refetchOnWindowFocus: false,
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

  const { addToaster } = useAuthContext();

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
        addToaster(
          error.response?.data?.msg || error.response?.data || error.message,
        );
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    enabled: condition,
    suspense: suspense,
  });
};
