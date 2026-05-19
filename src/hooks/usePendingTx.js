/**
 * usePendingTx — Persist and restore pending transaction state across page reloads.
 *
 * MetaMask mobile reloads the page after wallet confirmation. This hook:
 *   1. Saves the pending tx hash + page path to sessionStorage before reload
 *   2. On mount, checks if a pending tx was in progress and restores the state
 *   3. Clears the saved state once the tx is confirmed or fails
 *
 * Usage:
 *   const { savePendingTx, clearPendingTx, pendingTxHash, pendingTxPage } = usePendingTx('buy')
 */
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";

const STORAGE_KEY = "bw_pending_tx";

export const usePendingTx = (flowKey) => {
  const router = useRouter();
  const [pendingTxHash, setPendingTxHash] = useState(null);
  const [pendingTxPage, setPendingTxPage] = useState(null);
  const [isRestored, setIsRestored] = useState(false);

  // On mount: check if there's a saved pending tx for this flow
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved.flowKey === flowKey && saved.txHash) {
        setPendingTxHash(saved.txHash);
        setPendingTxPage(saved.page);
        setIsRestored(true);
      }
    } catch {
      // Malformed storage — ignore
    }
  }, [flowKey]);

  /**
   * Call this just before a transaction is submitted.
   * Saves the flow key + current page so we can restore after reload.
   */
  const savePendingTx = useCallback(
    (txHash) => {
      try {
        sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            flowKey,
            txHash: txHash || "pending",
            page: router.asPath,
            savedAt: Date.now(),
          })
        );
        setPendingTxHash(txHash || "pending");
      } catch {
        // sessionStorage not available (private mode) — ignore
      }
    },
    [flowKey, router.asPath]
  );

  /**
   * Call this when the transaction is confirmed, failed, or cancelled.
   */
  const clearPendingTx = useCallback(() => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setPendingTxHash(null);
    setPendingTxPage(null);
    setIsRestored(false);
  }, []);

  return {
    savePendingTx,
    clearPendingTx,
    pendingTxHash,
    pendingTxPage,
    isRestored,
  };
};
