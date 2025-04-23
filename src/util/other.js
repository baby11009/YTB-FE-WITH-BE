import request from "./axios-base-url";
export const cleanSessionCookies = async (apiPath) => {
  await request.delete(`/redis/clean/random?apiPath=${apiPath}`);
};
