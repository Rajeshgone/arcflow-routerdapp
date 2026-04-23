import { AppKit } from "@circle-fin/app-kit";
import { createViemAdapterFromPrivateKey } from "@circle-fin/adapter-viem-v2";
import type { SendParams } from "@circle-fin/app-kit";
import { inspect } from "node:util";

const kit = new AppKit();

const sendTokens = async (): Promise<void> => {
  const adapter = createViemAdapterFromPrivateKey({
    privateKey: process.env.PRIVATE_KEY as string,
  });

  const sendParams: SendParams = {
    from: { adapter, chain: "Arc_Testnet" },
    to: "RECIPIENT_ADDRESS", // Replace with recipient address
    amount: "1.00",
    token: "USDC",
  };

  const estimate = await kit.estimateSend(sendParams);
  const result = await kit.send(sendParams);
  console.log(inspect(result, false, null, true));
};

void sendTokens();
