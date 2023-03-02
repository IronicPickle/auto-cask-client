import config, { isDev } from "@config/config";
import dayjs from "dayjs";

export const log = (...text: any[]) => {
  if (isDev) console.log("[Development]", ...text);
};

export const sleep = (duration: number) => new Promise(resolve => setTimeout(resolve, duration));

export const generateBadgeImageUrl = (_id: string) =>
  `${config.apiUrl}/images/badges/${_id}/badge.jpg?timestamp=${dayjs().toISOString()}`;
