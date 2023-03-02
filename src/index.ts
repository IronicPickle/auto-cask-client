import setupBonjour from "@bonjour/setupBonjour";
import setupExpress from "@express/setupExpress";
import setupApiLink from "./pumpClient/setupApiLink";
import setupZeromq from "./zmq/setupZmq";
import setupPuppeteer from "./puppeteer/setupPuppeteer";

import { config as loadEnv } from "dotenv";

loadEnv();

const start = async () => {
  await setupPuppeteer();
  await setupApiLink();
  setupExpress();
  await setupBonjour();
  await setupZeromq();
};

start();
