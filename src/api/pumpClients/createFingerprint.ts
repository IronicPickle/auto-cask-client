import type { PumpClientFingerprint } from "@shared/ts/api/pumpClients";
import { api } from "@api/api";
import { RequestInputs } from "@shared/ts/api/generic";

export default async ({ params: { mac }, body }: RequestInputs<PumpClientFingerprint>) => {
  const { data } = await api.post<PumpClientFingerprint["res"]>(
    `/pumpClients/${mac}/fingerprint`,
    body,
  );
  return data;
};
