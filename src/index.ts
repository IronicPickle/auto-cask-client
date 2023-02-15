import setupBonjour from "@bonjour/setupBonjour";
import setupExpress from "@express/setupExpress";
import setupApiLink from "./pumpClient/setupApiLink";
import { config as loadEnv } from "dotenv";

loadEnv();

const start = async () => {
  if (!process.env.API_ACCESS_TOKEN) await setupApiLink();

  setupExpress();

  await setupBonjour();
};

start();
