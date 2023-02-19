import type { PumpClientFingerprint } from "@shared/ts/api/pumpClients";
import { api } from "@api/api";
import { RequestInputs } from "@src/../../auto-cask-shared/ts/api/generic";

export default async ({ body }: RequestInputs<PumpClientFingerprint>) => {
  const { data } = await api.post<PumpClientFingerprint["res"]>(
    "/pumpClient/:mac/fingerprint",
    body,
  );
  return data;
};
