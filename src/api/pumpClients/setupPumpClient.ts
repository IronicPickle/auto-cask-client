import type { PumpClientSetup } from "@shared/ts/api/pumpClients";
import { api } from "@api/api";
import { RequestInputs } from "@shared/ts/api/generic";

export default async ({ body }: RequestInputs<PumpClientSetup>) => {
  const { data } = await api.post<PumpClientSetup["res"]>("/pumpClients/setup", body);
  return data;
};
