import setupBonjour from "@bonjour/setupBonjour";
import setupExpress from "@express/setupExpress";
import setupApiLink from "./pumpClient/setupApiLink";
import { config as loadEnv } from "dotenv";
import setupZeromq from "./zmq/setupZmq";

loadEnv();

const start = async () => {
  await setupApiLink();

  setupExpress();

  await setupBonjour();

  setupZeromq();
};

start();
