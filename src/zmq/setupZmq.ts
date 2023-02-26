import config from "@config/config";
import { log } from "@lib/utils/generic";
import { Dealer } from "zeromq";
import { zmqDeserialise, zmqSerialise } from "@shared/utils/zmq";
import { ZmqRequestType } from "@shared/enums/zmq";
import { envWrite } from "@lib/utils/env";
import { bonjourPublish, bonjourUnpublish } from "@bonjour/setupBonjour";
import { setPageBadge } from "@src/puppeteer/setupPuppeteer";
import { Badge } from "@src/../../auto-cask-shared/ts/api/generic";

export const sock = new Dealer({});

export const sockSend = async (type: ZmqRequestType, data: object) =>
  await sock.send(["", zmqSerialise(type, data)]);

export default async () => {
  const { PUBLIC_KEY, SECRET_KEY, SERVER_PUBLIC_KEY } = process.env;

  if (!PUBLIC_KEY || !SECRET_KEY || !SERVER_PUBLIC_KEY) throw Error("Missing one or more ZMQ keys");

  sock.curvePublicKey = PUBLIC_KEY;
  sock.curveSecretKey = SECRET_KEY;
  sock.curveServerKey = SERVER_PUBLIC_KEY;
  sock.routingId = PUBLIC_KEY;

  sock.events.on("connect", () => sockSend(ZmqRequestType.GetBadge, {}));

  sock.connect(config.zmqUrl);
  log("[ZMQ]", "Connected to", config.zmqUrl);

  for await (const frames of sock) {
    try {
      const res = zmqDeserialise(frames[1]);
      if (!res) continue;

      const { type, data } = res;

      log("[ZMQ]", type, data);

      switch (type) {
        case ZmqRequestType.PumpAssociated: {
          bonjourUnpublish();
          envWrite("PUMP_ASSOCIATED", "true");
          break;
        }
        case ZmqRequestType.PumpUnassociated: {
          bonjourPublish();
          envWrite("PUMP_ASSOCIATED", "false");
          break;
        }
        case ZmqRequestType.BadgeData: {
          const badge = data as Badge;
          setPageBadge(badge._id);
          break;
        }
      }
    } catch (err) {
      console.error(err);
    }
  }
};
