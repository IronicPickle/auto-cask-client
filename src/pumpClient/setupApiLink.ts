import { apiCall } from "@api/api";
import setupPumpClient from "@api/pumpClients/setupPumpClient";
import macaddress from "macaddress";
import fs from "fs";
import path from "path";
import { config as loadEnv } from "dotenv";
import { log } from "@lib/utils/generic";

export default async () => {
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

  const envPath = path.join(__dirname, "../../.env");
  const envLine = `\nAPI_ACCESS_TOKEN=${data.accessToken}`;

  if (fs.existsSync(envPath)) {
    let envFile = fs.readFileSync(envPath, {
      encoding: "utf-8",
    });

    if (envFile.includes("API_ACCESS_TOKEN="))
      envFile = envFile.replace(/(API_ACCESS_TOKEN=)(.*)(\n?)/g, `$1${data.accessToken}$3`);
    else envFile = `${envFile}${envLine}`;

    fs.writeFileSync(envPath, envFile, {
      encoding: "utf-8",
    });
  } else {
    fs.appendFileSync(envPath, envLine, {
      encoding: "utf-8",
    });
  }

  loadEnv();
};
