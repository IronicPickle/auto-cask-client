import config from "@config/config";
import { log } from "@utils/generic";
import Bonjour from "bonjour-service";
import macaddress from "macaddress";

const client = new Bonjour();

export default async () => {
  const mac = await macaddress.one();

  client.unpublishAll();
  const service = client.publish({
    name: `Auto Cask Client (${mac})`,
    protocol: "tcp",
    type: "http",
    port: config.httpPort,
    host: "local",
    txt: {
      mac,
    },
  });

  service.on("error", err => log(err));

  service.on("up", () => log("[Bonjour]", `Service broadcasting with mac address ${mac}`));
};
