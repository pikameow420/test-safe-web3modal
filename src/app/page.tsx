'use client'

import ConnectButton from "./components/connect-button";
import { BatchTransaction } from "./components/batch-transaction";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ConnectButton />
      <BatchTransaction />
    </main>
  );
}

