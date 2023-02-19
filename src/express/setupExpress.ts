import config from "@config/config";
import { log } from "@lib/utils/generic";
import express from "express";
import { CreateFingerprint } from "@shared/ts/api/fingerprint";
import fingerprintValidators from "@shared/validators/fingerprintValidators";
import { parseValidators } from "@shared/utils/generic";
import { conflictError, error, ok, validationError } from "@shared/utils/api";
import { apiCall } from "@api/api";
import macaddress from "macaddress";
import createFingerprint from "@api/pumpClients/createFingerprint";
import WrappedRouter from "@lib/utils/WrappedRouter";

export const expressServer = express();

export default () => {
  expressServer.use(express.json());
  expressServer.use(
    express.urlencoded({
      extended: true,
    }),
  );

  expressServer.listen(config.httpPort, () => log("[Express]", `Listening on ${config.httpPort}`));

  const router = new WrappedRouter();

  router.post<CreateFingerprint>("/fingerprint", async (req, res) => {
    try {
      if (process.env.PUMP_ASSOCIATED === "true")
        return conflictError("Cannot fingerprint on a pump client already associated")(res);

      const validators = fingerprintValidators.create(req.body);
      const validation = parseValidators(validators);

      const { userId } = req.body;

      if (validation.failed || !userId) return validationError(validation)(res);

      const mac = await macaddress.one();

      if (!mac) throw new Error("Could not attain network interfaces' MAC address");

      const { data, error } = await apiCall(createFingerprint, {
        params: { mac },
        body: { userId },
      });

      if (error || !data) return ok(error, 400)(res);

      ok(data)(res);
    } catch (err) {
      console.error(err);
      error("Something went wrong.")(res);
    }
  });

  expressServer.use("/", router.router);
};
