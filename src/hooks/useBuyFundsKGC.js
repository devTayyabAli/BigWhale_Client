// ** WEB3 Imports
import { useContractWrite, useWaitForTransaction } from "wagmi";
import { CONTRACT_INFO } from "src/contract";

const useBuyFundsKGC = () => {
  // buyBW contract write
  const {
    isError: isBuyFundsSentError,
    data: buyFundsSentTx,
    isLoading: isBuyFundsUsdcSentTxInProgress,
    isSuccess: isBuyFundsUsdcTxSent,
    write: buyFundsKGC, // Renamed the function
    error: buyFundsSentError
  } = useContractWrite({
    address: CONTRACT_INFO.main.address,
    abi: CONTRACT_INFO.main.abi,
    functionName: "buyBW",
    // wagmi v1: skip simulateContract pre-flight — args are passed at call time
    mode: "recklesslyUnprepared",
  });

  const {
    isLoading: isBuyFundsTokensWaiting,
    isSuccess: isBuyFundsCompleted,
    isError: isBuyFundsError,
    error: buyFundsTxError
  } = useWaitForTransaction({
    hash: buyFundsSentTx?.hash,
  });

  return {
    //buyFunds
    isBuyFundsSentError,
    buyFundsSentTx,
    isBuyFundsUsdcSentTxInProgress,
    isBuyFundsUsdcTxSent,
    buyFundsKGC, // Renamed the function
    isBuyFundsCompleted,
    isBuyFundsError,
    isBuyFundsTokensWaiting,
    buyFundsSentError,
    buyFundsTxError
  };
};

export default useBuyFundsKGC;
