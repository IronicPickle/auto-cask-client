import config from "@config/config";
import { log } from "@lib/utils/generic";
import express from "express";
import { SendFingerprintReq, SendFingerprintRes } from "@shared/ts/api/fingerprint";
import { Fingerprint } from "@lib/ts/generic";
import fingerprintValidators from "@shared/validators/fingerprintValidators";
import { parseValidators } from "@shared/utils/generic";
import { error, ok, validationError } from "@shared/utils/api";
import { apiCall } from "@api/api";
import sendFingerprint from "@api/pumpClients/sendFingerprint";
import macaddress from "macaddress";

export const expressServer = express();

export default () => {
  expressServer.use(express.json());
  expressServer.use(
    express.urlencoded({
      extended: true,
    }),
  );

  expressServer.listen(config.httpPort, () => log("[Express]", `Listening on ${config.httpPort}`));

  expressServer.post<"/fingerprint", {}, SendFingerprintRes, Partial<SendFingerprintReq>>(
    "/fingerprint",
    async (req, res) => {
      try {
        const validators = fingerprintValidators.send(req.body);
        const validation = parseValidators(validators);

        const { userId } = req.body;

        if (validation.failed || !userId) return validationError(validation)(res);

        const fingerprint: Fingerprint = { userId };

        const mac = await macaddress.one();

        if (!mac) throw new Error("Could not attain network interfaces' MAC address");

        const { data, error } = await apiCall(sendFingerprint, {
          mac,
          userId,
        });

        if (error || !data) return ok(error, 400)(res);

        ok(data)(res);
      } catch (err) {
        console.error(err);
        error("Something went wrong.")(res);
      }
    },
  );
};
