import type { PumpClientSetupReq, PumpClientSetupRes } from "@shared/ts/api/pumpClients";
import { api } from "@api/api";

export default async ({ mac }: PumpClientSetupReq) => {
  const { data } = await api.post<PumpClientSetupRes>("/pumpClient/setup", {
    mac,
  });
  return data;
};
