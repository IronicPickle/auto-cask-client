import config from "@config/config";
import { log } from "@lib/utils/generic";
import { Dealer, curveKeyPair } from "zeromq";
import { serialiseZmqRequest, getZmqData } from "@shared/utils/zmq";

export default async () => {
  const { secretKey, publicKey } = curveKeyPair();

  console.log({ secretKey, publicKey });

  const sock = new Dealer({
    curveSecretKey: secretKey,
    curvePublicKey: publicKey,
    curveServerKey: "%6S$l}8K9v}/h$P-T}>^7*a9N?hFh*@&HQB6Wd^V",
    routingId: "Test",
  });

  sock.connect(config.zmqUrl);
  log("[ZMQ]", "Connected to", config.zmqUrl);

  await sock.send([
    "",
    serialiseZmqRequest("sub-req", {
      val: "hi",
    }),
  ]);

  for await (const frames of sock) {
    try {
      const data = getZmqData(frames, 1);
      if (!data) continue;

      console.log({ data });
    } catch (err) {
      console.error(err);
    }
  }
};
/////
