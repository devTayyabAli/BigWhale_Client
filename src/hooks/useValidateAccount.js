import { useAccount, useChainId, useNetwork } from "wagmi";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { ENV } from "src/configs/env";

const useValidateAccount = () => {
  const [accError, setAccError] = useState(null);
  const [chainError, setChainAccError] = useState(null);
  const user = useSelector((state) => state?.login?.user);
  const { address, status, chainId: chainId2 } = useAccount();
  const account = useAccount();

  const chainId = useChainId();
  const { chain } = useNetwork();

  useEffect(() => {
    // ── MetaMask mobile reload guard ──────────────────────────────────────
    // MetaMask mobile reloads the page after every tx confirmation.
    // wagmi status is "reconnecting" or "connecting" while autoConnect runs.
    // Do NOT set accError during this window — wait until wagmi has settled.
    if (status === 'reconnecting' || status === 'connecting') {
      return;
    }

    if (
      (address &&
        user?.data?.walletAddress &&
        address !== user?.data?.walletAddress) ||
      !address
    ) {
      setAccError(true);
    } else if (
      address &&
      user?.data?.walletAddress &&
      address === user?.data?.walletAddress
    ) {
      setAccError(false);
    } else {
      setAccError(true);
    }
  }, [address, status, user]);

  useEffect(() => {
    if (chain?.id != ENV.chainId) {
      setChainAccError(true);
    } else {
      setChainAccError(false);
    }
  }, [chain?.id]);

  return { accError, chainError, chain };
};

export default useValidateAccount;
