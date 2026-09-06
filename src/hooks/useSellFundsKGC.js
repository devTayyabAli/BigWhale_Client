// ** WEB3 Imports
import { useContractWrite, useWaitForTransaction } from "wagmi";
import { CONTRACT_INFO } from "src/contract";

const useSellFundsKGC = () => {
  // sellBW contract write
  const {
    isError: isSellFundsSentError,
    data: sellFundsSentTx,
    isLoading: isSellFundsUsdcTxInProgress,
    isSuccess: isSellFundsUsdcTxSent,
    write: sellFundsKGC, // Renamed the function
    error: sellFundsSentError
  } = useContractWrite({
    address: CONTRACT_INFO.main.address,
    abi: CONTRACT_INFO.main.abi,
    functionName: "sellBW",
    // wagmi v1: skip simulateContract pre-flight — args are passed at call time
    mode: "recklesslyUnprepared",
  });

  const {
    isLoading: isSellFundsTokensWaiting,
    isSuccess: isSellFundsCompleted,
    isError: isSellFundsError,
    error: sellFundsTxError
  } = useWaitForTransaction({
    hash: sellFundsSentTx?.hash,
  });

  return {
    //sellFunds
    isSellFundsSentError,
    sellFundsSentTx,
    isSellFundsUsdcTxInProgress,
    isSellFundsUsdcTxSent,
    sellFundsKGC, // Renamed the function
    isSellFundsCompleted,
    isSellFundsError,
    isSellFundsTokensWaiting,
    sellFundsSentError,
    sellFundsTxError
  };
};

export default useSellFundsKGC;
