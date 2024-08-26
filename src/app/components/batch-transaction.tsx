"use client";

import { useAccount, useConnect, useDisconnect, useEnsName } from "wagmi";
import { useSendUSDC } from "../useSendUSDC";
import { useAutoConnect } from "../useAutoConnect";
import { useState } from "react";
import { useSafeAppsSDK } from "@safe-global/safe-apps-react-sdk";

export function BatchTransaction() {
  useAutoConnect();

  const { error: connectError } = useConnect();
  const { connector: activeConnector, chain, address } = useAccount();
  const { disconnect } = useDisconnect();
  const { sdk } = useSafeAppsSDK();
  const { sendUSDC, isPending, isError } = useSendUSDC();
  const [usdcAmount, setUsdcAmount] = useState("");
  const [txHash, setTxHash] = useState<string | null>(null);

  const { data: ensNameData } = useEnsName({ address });

  const handleSend = async () => {
    try {
      const transactions = await sendUSDC(usdcAmount);
      const { safeTxHash } = await sdk.txs.send({
        txs: transactions,
      });
      console.log("Transaction sent:", safeTxHash);
      setTxHash(safeTxHash);
    } catch (err) {
      console.error("Failed to send transaction:", err);
    }
  };

  const getBlockExplorerLink = (hash: string): string | null => {
    if (!chain) return null;
    const baseUrl = chain.blockExplorers?.default.url;
    return baseUrl ? `${baseUrl}/tx/${hash}` : null;
  };

  return (
    <div>
      <div>
        {/* {address ? (
          <div>
            <div className="text-white p-2 text-md">
              {ensNameData ?? address}
              {ensNameData ? ` (${address})` : null}
            </div>
            <button
              className="bg-gray-00 border border-white text-white p-2 rounded-md hover:bg-red-500 transition-colors"
              onClick={() => disconnect()}
            >
              Disconnect
            </button>

          </div>
        ) : (
          <DynamicWidget
          innerButtonComponent={
            <button className="bg-blue-400 border border-white text-white p-2 rounded-md hover:bg-blue-700 transition-colors">
              Dynamic Connect
            </button>
          }
        />
        )} */}
      </div>

      {address && activeConnector?.id !== "safe" ? (
        <div className="text-red-500 mt-4 p-4 border border-red-500 rounded">
          Please open this app inside Safe or Coinshift to use it.
        </div>
      ) : address ? (
        <>
          {/* Batch transaction : We shall execute approve and execute in 1 transaction. This will also resolve the issue of having to provide infinite approvals. */}
          <div className="mt-4">
            <input
              type="text"
              value={usdcAmount}
              onChange={(e) => setUsdcAmount(e.target.value)}
              placeholder="USDC Amount"
              className="p-2 border rounded mr-2 text-black"
              min={0}
              step={0.000001}
            />
            <button
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-400 transition-colors disabled:bg-gray-400"
              onClick={handleSend}
              disabled={isPending || !usdcAmount}
            >
              {isPending ? "Sending..." : "Send USDC"}
            </button>
          </div>
          {txHash && (
            <div className="mt-4">
              <a
                href={getBlockExplorerLink(txHash) || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View transaction on block explorer
              </a>
            </div>
          )}
        </>
      ) : null}
      {connectError && (
        <div className="text-red-500 mt-4">{connectError.message}</div>
      )}
      {isError && <div className="text-red-500 mt-4">Error sending USDC</div>}
    </div>
  );
}