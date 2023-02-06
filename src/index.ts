import setupBonjour from "@bonjour/setupBonjour";
import setupExpress from "@express/setupExpress";

const start = async () => {
  setupExpress();
  setupBonjour();
};

start();
