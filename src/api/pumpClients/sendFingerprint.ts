import type {
  PumpClientFingerprintReq,
  PumpClientFingerprintRes,
} from "@shared/ts/api/pumpClients";
import { api } from "@api/api";

export default async ({ mac, userId }: PumpClientFingerprintReq) => {
  const { data } = await api.post<PumpClientFingerprintRes>("/pumpClient/fingerprint", {
    mac,
    userId,
  });
  return data;
};
