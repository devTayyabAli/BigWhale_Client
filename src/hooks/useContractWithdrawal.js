// ** WEB3 Imports
import { useContractWrite, useWaitForTransaction } from "wagmi";
import { CONTRACT_INFO } from "src/contract";
import { useEffect } from "react";

const useContractWithdrawal = (setLoader) => {
  const {
    isError: isWithdrawSentError,
    data: withdrawSentTx,
    isLoading: isWithdrawUsdcTxInProgress,
    isSuccess: isWithdrawUsdcTxSent,
    write: withdrawFunds,
    error: withdrawSentError,
  } = useContractWrite({
    address: CONTRACT_INFO.main.address,
    abi: CONTRACT_INFO.main.abi,
    functionName: "withdrawAmount",
  });

  const {
    isLoading: isWithdrawalTokensWaiting,
    isSuccess: isWithdrawalCompleted,
    isError: isWithdrawalError,
    error: withdrawTxError,
  } = useWaitForTransaction({
    hash: withdrawSentTx?.hash,
  });

  // Reset loader when the transaction settles (success or error)
  useEffect(() => {
    if (isWithdrawalCompleted || isWithdrawalError || isWithdrawSentError) {
      setLoader?.(false);
    }
  }, [isWithdrawalCompleted, isWithdrawalError, isWithdrawSentError]);

  return {
    withdrawFunds,
    withdrawSentTx,
    isWithdrawUsdcTxInProgress,
    isWithdrawUsdcTxSent,
    isWithdrawSentError,
    withdrawSentError,
    isWithdrawalTokensWaiting,
    isWithdrawalCompleted,
    isWithdrawalError,
    withdrawTxError,
  };
};

export default useContractWithdrawal;
