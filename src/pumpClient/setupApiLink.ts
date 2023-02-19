import { apiCall } from "@api/api";
import setupPumpClient from "@api/pumpClients/setupPumpClient";
import macaddress from "macaddress";
import { log } from "@lib/utils/generic";
import { envWrite } from "@lib/utils/env";

export default async () => {
  const { PUBLIC_KEY, SECRET_KEY, SERVER_PUBLIC_KEY } = process.env;
  if (PUBLIC_KEY && SECRET_KEY && SERVER_PUBLIC_KEY) return;

  log("[Api Link]", "Running first time pump client setup");

  const mac = await macaddress.one();

  if (!mac) throw new Error("Could not attain network interfaces' MAC address");

  const { data, error } = await apiCall(setupPumpClient, {
    mac,
  });

  if (error || !data) {
    console.error(error);
    throw new Error("Failed to setup pump client");
  }

  envWrite("PUBLIC_KEY", data.publicKey);
  envWrite("SECRET_KEY", data.secretKey);
  envWrite("SERVER_PUBLIC_KEY", data.serverPublicKey);
};