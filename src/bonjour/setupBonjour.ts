import config from "@config/config";
import { log } from "@utils/generic";
import Bonjour from "bonjour-service";
import macaddress from "macaddress";

export const bonjourClient = new Bonjour();

export default async () => {
  if (process.env.PUMP_ASSOCIATED === "true") return;

  bonjourPublish();
};

export const bonjourUnpublish = () => {
  bonjourClient.unpublishAll(() => log("[Bonjour]", "Unpublished service"));
};

export const bonjourPublish = async () => {
  const mac = await macaddress.one();

  bonjourClient.unpublishAll();
  const service = bonjourClient.publish({
    name: `Auto Cask Client (${mac})`,
    protocol: "tcp",
    type: "http",
    port: config.httpPort,
    host: `${mac}.local`,
    txt: {
      mac,
    },
  });

  service.on("error", err => console.error(err));

  service.on("up", () => log("[Bonjour]", `Service broadcasting with mac address ${mac}`));
};
