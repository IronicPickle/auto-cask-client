import config from "@config/config";
import { log } from "@lib/utils/generic";
import express from "express";
import { SendFingerprintReq, SendFingerprintRes } from "@shared/ts/api/fingerprint";
import { Fingerprint } from "@lib/ts/generic";
import fingerprintValidators from "@shared/validators/fingerprintValidators";
import { parseValidators } from "@shared/utils/generic";
import { ok, validationError } from "@shared/utils/api";

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
    (req, res) => {
      const validators = fingerprintValidators.send(req.body);
      const validation = parseValidators(validators);

      const { userId } = req.body;

      if (validation.failed || !userId) return validationError(validation)(res);

      const fingerprint: Fingerprint = { userId };

      console.log(fingerprint);

      ok({})(res);
    },
  );
};
