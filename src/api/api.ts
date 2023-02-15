import config from "@config/config";
import axios, { AxiosError } from "axios";
import { ApiError } from "@shared/ts/api/generic";
import { log } from "@lib/utils/generic";
import { GenericErrorCode } from "@shared/enums/api/generic";

export const isAxiosError = <K extends string | number | symbol>(
  err: any,
): err is AxiosError<ApiError<K>> => err.isAxiosError;

export const getErrorFromApiErr = <K extends string | number | symbol>(err: any): ApiError<K> => {
  log(err);
  if (isAxiosError<K>(err)) {
    const data = err.response?.data;
    if (data) return data;
  }

  return {
    error: err.message ?? err,
    errorCode: GenericErrorCode.AxiosError,
  } as ApiError<K>;
};

export const api = axios.create({
  baseURL: config.apiUrl,
});

api.interceptors.request.use(async reqConfig => {
  const accessToken = process.env.API_ACCESS_TOKEN;

  if (accessToken) reqConfig.headers["Authorization"] = `Bearer ${accessToken}`;

  return reqConfig;
});

export const apiCall = async <D, R>(func: (reqData: D) => Promise<R>, reqData: D) => {
  const res: { error: ApiError<keyof D> | undefined; data: R | undefined } = {
    data: undefined,
    error: undefined,
  };
  try {
    const data = await func(reqData);
    res.data = data;
  } catch (err) {
    const error = getErrorFromApiErr(err);
    res.error = error;
  }

  return res;
};
