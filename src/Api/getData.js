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

  const paramsEntries = [...Object.entries(params)];

  const queryFnParams = {};

  const queryKeyValue = [path];

  if (paramsEntries.length > 0) {
    const resetKeys = ["clearCache", "reset"];

    const notResetKeys = [""];

    for (const [key, value] of paramsEntries) {
      if (!resetKeys.includes(key)) {
        queryFnParams[key] = value;
      }

      if (!notResetKeys.includes(key)) {
        queryKeyValue.push(value);
      }
    }
  }

  return useQuery({
    queryKey: [...queryKeyValue],
    queryFn: async () => {
      try {
        const res = await request.get(path, {
          params: {
            ...queryFnParams,
          },
        });
    
        return res.data || [];
      } catch (error) {
        console.error(error.response.data);

        if (addToaster) {
          addToaster(
            error.response.data?.message ||
              error.response?.data.msg ||
              error.message,
          );
        }
        // throw error;
      }
    },
    refetchOnWindowFocus: false,
    enabled: condition,
    suspense,
  });
};
