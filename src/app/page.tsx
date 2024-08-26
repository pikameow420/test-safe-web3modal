'use client'

import ConnectButton from "./components/connect-button";
import { BatchTransaction } from "./components/batch-transaction";
import { useAccount } from "wagmi";

export default function Home() {
  const {isConnected} = useAccount()
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-y-8 p-24">
      <ConnectButton />
      {isConnected && <BatchTransaction />}
    </main>
  );
}

